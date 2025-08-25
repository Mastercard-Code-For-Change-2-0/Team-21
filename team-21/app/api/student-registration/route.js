import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { currentUser } from '@clerk/nextjs/server';

// Generate student code
function generateStudentCode() {
  const timestamp = Date.now().toString().slice(-6);
  return `Y4D_K_${timestamp}`;
}

// POST - Create or update student registration
export async function POST(request) {
  try {
    const data = await request.json();
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated'
      }, { status: 401 });
    }

    await connectDB();

    // Check if user already exists
    let existingUser = await User.findOne({ clerkId: user.id });

    if (existingUser) {
      // Update existing user
      const updateData = {
        full_name: data.name,
        email: user.emailAddresses[0]?.emailAddress,
        dob: data.dateOfBirth ? new Date(data.dateOfBirth) : existingUser.dob,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        employment_status: data.employmentStatus,
        father_occupation: data.fatherOccupation,
        mother_occupation: data.motherOccupation,
        education_level: data.highestDegree,
        cgpa_percentage: data.cgpaPercentage,
        college_name: data.universityName,
        updated_at: new Date()
      };

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: user.id },
        updateData,
        { new: true, runValidators: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Student registration updated successfully',
        data: {
          id: updatedUser._id,
          student_code: updatedUser.student_code,
          full_name: updatedUser.full_name,
          email: updatedUser.email
        }
      });
    } else {
      // Generate unique student code and username
      let studentCode;
      let username;
      let isUnique = false;
      while (!isUnique) {
        studentCode = generateStudentCode();
        // Create username from email + timestamp to ensure uniqueness
        const baseUsername = user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'student';
        username = `${baseUsername}_${Date.now().toString().slice(-4)}`;
        
        const existing = await User.findOne({ 
          $or: [
            { student_code: studentCode },
            { username: username }
          ]
        });
        if (!existing) isUnique = true;
      }

      // Create new student user
      const studentData = {
        clerkId: user.id,
        username: username,
        email: user.emailAddresses[0]?.emailAddress,
        full_name: data.name,
        dob: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        employment_status: data.employmentStatus,
        father_occupation: data.fatherOccupation,
        mother_occupation: data.motherOccupation,
        education_level: data.highestDegree,
        cgpa_percentage: data.cgpaPercentage,
        college_name: data.universityName,
        role: 'student',
        student_code: studentCode,
        enrollment_date: new Date(),
        status: 'active'
      };

      const newStudent = await User.create(studentData);

      return NextResponse.json({
        success: true,
        message: 'Student registered successfully',
        data: {
          id: newStudent._id,
          student_code: newStudent.student_code,
          full_name: newStudent.full_name,
          email: newStudent.email
        }
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Student registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to register student',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Get current user's student data
export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated'
      }, { status: 401 });
    }

    await connectDB();

    const studentData = await User.findOne({ clerkId: user.id })
      .select('-password_hash')
      .populate('assigned_mentor', 'full_name email');

    if (!studentData) {
      return NextResponse.json({
        success: false,
        message: 'Student data not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: studentData
    });

  } catch (error) {
    console.error('Get student data error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch student data',
      error: error.message
    }, { status: 500 });
  }
}
