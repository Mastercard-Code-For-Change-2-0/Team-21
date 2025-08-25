import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// Generate student code
function generateStudentCode() {
  const timestamp = Date.now().toString().slice(-6);
  return `Y4D_K_${timestamp}`;
}

// POST - Create new student
export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    // Generate unique student code
    let studentCode;
    let isUnique = false;
    while (!isUnique) {
      studentCode = generateStudentCode();
      const existing = await User.findOne({ student_code: studentCode });
      if (!existing) isUnique = true;
    }

    // Create student user
    const studentData = {
      ...data,
      role: 'student',
      student_code: studentCode,
      enrollment_date: new Date(),
      status: 'active'
    };

    const student = await User.create(studentData);

    return NextResponse.json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: student._id,
        student_code: student.student_code,
        full_name: student.full_name,
        email: student.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Student registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to register student',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Fetch all students (with pagination)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    await connectDB();

    // Build query
    let query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { student_code: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      query.status = status;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated results
    const students = await User.find(query)
      .select('-password_hash')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('assigned_mentor', 'full_name email');

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    }, { status: 500 });
  }
}
