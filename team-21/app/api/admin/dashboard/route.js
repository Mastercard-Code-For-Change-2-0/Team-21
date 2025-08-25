import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from "@/lib/models/User";

// GET - Admin dashboard data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame') || '30'; // days

    await connectDB();
    

    const now = new Date();
    const timeFrameDate = new Date(now.getTime() - (parseInt(timeFrame) * 24 * 60 * 60 * 1000));

    // Get overall statistics
    const [
      totalStudents,
      totalMentors,
      totalAdmins,
      activeStudents,
      recentRegistrations,
      placedStudents,
      totalDocuments,
      verifiedDocuments,
      totalProfessionalRecords
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'student', status: 'active' }),
      User.countDocuments({ 
        role: 'student', 
        created_at: { $gte: timeFrameDate } 
      }),
      User.countDocuments({ 
        role: 'student', 
        placement_status: { $in: ['Placed', 'Multiple Offers'] }
      }),
      User.aggregate([
        { $unwind: '$marksheets' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      User.aggregate([
        { $unwind: '$marksheets' },
        { $match: { 'marksheets.verified': true } },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0),
      User.aggregate([
        { $unwind: '$professional_growth' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    ]);

    // Get placement statistics
    const placementStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$placement_status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activities
    const recentStudents = await User.find({ role: 'student' })
      .select('full_name email student_code created_at placement_status')
      .sort({ created_at: -1 })
      .limit(10);

    // Get mentor-student assignments
    const mentorAssignments = await User.find({ role: 'mentor' })
      .select('full_name email assigned_students')
      .populate('assigned_students', 'full_name student_code');

    // Monthly registration trends (last 12 months)
    const monthlyTrends = await User.aggregate([
      {
        $match: {
          role: 'student',
          created_at: { $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalMentors,
          totalAdmins,
          activeStudents,
          recentRegistrations,
          placedStudents,
          placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0
        },
        documents: {
          totalDocuments,
          verifiedDocuments,
          verificationRate: totalDocuments > 0 ? ((verifiedDocuments / totalDocuments) * 100).toFixed(1) : 0
        },
        professional: {
          totalRecords: totalProfessionalRecords
        },
        placementStats: placementStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        recentStudents,
        mentorAssignments,
        monthlyTrends
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch admin dashboard data',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Admin actions (assign mentor, update status, etc.)
export async function POST(request) {
  try {
    const data = await request.json();
    const { action, studentId, mentorId, status } = data;

    await connectDB();
    

    switch (action) {
      case 'assign_mentor':
        // Assign mentor to student
        const [student, mentor] = await Promise.all([
          User.findById(studentId),
          User.findById(mentorId)
        ]);

        if (!student || student.role !== 'student') {
          return NextResponse.json({
            success: false,
            message: 'Student not found'
          }, { status: 404 });
        }

        if (!mentor || mentor.role !== 'mentor') {
          return NextResponse.json({
            success: false,
            message: 'Mentor not found'
          }, { status: 404 });
        }

        // Update assignments
        student.assigned_mentor = mentorId;
        if (!mentor.assigned_students.includes(studentId)) {
          mentor.assigned_students.push(studentId);
        }

        await Promise.all([student.save(), mentor.save()]);

        return NextResponse.json({
          success: true,
          message: 'Mentor assigned successfully'
        });

      case 'update_status':
        const userToUpdate = await User.findById(studentId);
        if (!userToUpdate) {
          return NextResponse.json({
            success: false,
            message: 'User not found'
          }, { status: 404 });
        }

        userToUpdate.status = status;
        await userToUpdate.save();

        return NextResponse.json({
          success: true,
          message: 'Status updated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to perform admin action',
      error: error.message
    }, { status: 500 });
  }
}
