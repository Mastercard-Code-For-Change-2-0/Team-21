import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getModels } from '@/lib/models/User';

// GET - Get specific student
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const connection = await connectDB();
    const { User } = getModels(connection);

    const student = await User.findById(id)
      .select('-password_hash')
      .populate('assigned_mentor', 'full_name email')
      .populate('professional_growth');

    if (!student || student.role !== 'student') {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Update student
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const connection = await connectDB();
    const { User } = getModels(connection);

    const student = await User.findOneAndUpdate(
      { _id: id, role: 'student' },
      { ...data, updated_at: new Date() },
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete student
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const connection = await connectDB();
    const { User } = getModels(connection);

    const student = await User.findOneAndDelete({ _id: id, role: 'student' });

    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    }, { status: 500 });
  }
}
