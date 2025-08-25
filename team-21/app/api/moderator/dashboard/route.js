import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getModels } from '@/lib/models/User';

// GET - Moderator dashboard data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const timeFrame = searchParams.get('timeFrame') || '30'; // days

    const connection = await connectDB();
    const { User } = getModels(connection);

    if (!mentorId) {
      return NextResponse.json({
        success: false,
        message: 'Mentor ID is required'
      }, { status: 400 });
    }

    const now = new Date();
    const timeFrameDate = new Date(now.getTime() - (parseInt(timeFrame) * 24 * 60 * 60 * 1000));

    // Get mentor details
    const mentor = await User.findById(mentorId)
      .populate('assigned_students', 'full_name student_code email placement_status created_at');

    if (!mentor || mentor.role !== 'mentor') {
      return NextResponse.json({
        success: false,
        message: 'Mentor not found'
      }, { status: 404 });
    }

    // Get assigned students statistics
    const assignedStudentIds = mentor.assigned_students.map(s => s._id);
    
    const [
      totalAssignedStudents,
      activeStudents,
      placedStudents,
      recentActivities,
      studentProgress
    ] = await Promise.all([
      assignedStudentIds.length,
      User.countDocuments({ 
        _id: { $in: assignedStudentIds }, 
        status: 'active' 
      }),
      User.countDocuments({ 
        _id: { $in: assignedStudentIds }, 
        placement_status: { $in: ['Placed', 'Multiple Offers'] }
      }),
      User.find({ 
        _id: { $in: assignedStudentIds },
        updated_at: { $gte: timeFrameDate }
      })
      .select('full_name student_code updated_at placement_status')
      .sort({ updated_at: -1 })
      .limit(10),
      User.aggregate([
        { $match: { _id: { $in: assignedStudentIds } } },
        { $unwind: { path: '$professional_growth', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            full_name: { $first: '$full_name' },
            student_code: { $first: '$student_code' },
            placement_status: { $first: '$placement_status' },
            total_experience: { $sum: 1 },
            latest_role: { $last: '$professional_growth.job_role' },
            latest_company: { $last: '$professional_growth.company_name' }
          }
        }
      ])
    ]);

    // Get document verification requests from assigned students
    const documentRequests = await User.aggregate([
      { $match: { _id: { $in: assignedStudentIds } } },
      { $unwind: '$marksheets' },
      { $match: { 'marksheets.verified': false } },
      {
        $project: {
          full_name: 1,
          student_code: 1,
          document: '$marksheets'
        }
      },
      { $limit: 20 }
    ]);

    // Get placement statistics for assigned students
    const placementStats = await User.aggregate([
      { $match: { _id: { $in: assignedStudentIds } } },
      {
        $group: {
          _id: '$placement_status',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        mentor: {
          id: mentor._id,
          full_name: mentor.full_name || mentor.username,
          email: mentor.email
        },
        overview: {
          totalAssignedStudents,
          activeStudents,
          placedStudents,
          placementRate: totalAssignedStudents > 0 ? ((placedStudents / totalAssignedStudents) * 100).toFixed(1) : 0
        },
        assignedStudents: mentor.assigned_students,
        recentActivities,
        studentProgress,
        documentRequests,
        placementStats: placementStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Moderator dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch moderator dashboard data',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Moderator actions
export async function POST(request) {
  try {
    const data = await request.json();
    const { action, mentorId, studentId, documentId, verified, feedback } = data;

    const connection = await connectDB();
    const { User } = getModels(connection);

    switch (action) {
      case 'verify_document':
        const student = await User.findById(studentId);
        if (!student) {
          return NextResponse.json({
            success: false,
            message: 'Student not found'
          }, { status: 404 });
        }

        // Find and update document verification
        const docIndex = student.marksheets.findIndex(
          doc => doc._id.toString() === documentId
        );

        if (docIndex === -1) {
          return NextResponse.json({
            success: false,
            message: 'Document not found'
          }, { status: 404 });
        }

        student.marksheets[docIndex].verified = verified;
        if (feedback) {
          student.marksheets[docIndex].feedback = feedback;
        }
        
        await student.save();

        return NextResponse.json({
          success: true,
          message: `Document ${verified ? 'verified' : 'rejected'} successfully`
        });

      case 'update_student_notes':
        const studentToUpdate = await User.findById(studentId);
        if (!studentToUpdate) {
          return NextResponse.json({
            success: false,
            message: 'Student not found'
          }, { status: 404 });
        }

        if (!studentToUpdate.mentor_notes) {
          studentToUpdate.mentor_notes = [];
        }

        studentToUpdate.mentor_notes.push({
          note: data.note,
          created_by: mentorId,
          created_at: new Date()
        });

        await studentToUpdate.save();

        return NextResponse.json({
          success: true,
          message: 'Note added successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Moderator action error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to perform moderator action',
      error: error.message
    }, { status: 500 });
  }
}
