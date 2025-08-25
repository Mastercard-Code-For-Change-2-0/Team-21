import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from "@/lib/models/User";

// PUT - Update professional growth record
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { userId, recordId, ...updateData } = data;

    await connectDB();
    

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Find and update the specific record
    const recordIndex = user.professional_growth.findIndex(
      record => record._id.toString() === recordId
    );

    if (recordIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Professional growth record not found'
      }, { status: 404 });
    }

    // Update the record
    user.professional_growth[recordIndex] = {
      ...user.professional_growth[recordIndex].toObject(),
      ...updateData,
      start_date: updateData.start_date ? new Date(updateData.start_date) : user.professional_growth[recordIndex].start_date,
      end_date: updateData.end_date ? new Date(updateData.end_date) : user.professional_growth[recordIndex].end_date
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Professional growth record updated successfully',
      data: user.professional_growth[recordIndex]
    });

  } catch (error) {
    console.error('Update professional growth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update professional growth record',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete professional growth record
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    await connectDB();
    

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Remove the specific record
    const initialLength = user.professional_growth.length;
    user.professional_growth = user.professional_growth.filter(
      record => record._id.toString() !== id
    );

    if (user.professional_growth.length === initialLength) {
      return NextResponse.json({
        success: false,
        message: 'Professional growth record not found'
      }, { status: 404 });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Professional growth record deleted successfully'
    });

  } catch (error) {
    console.error('Delete professional growth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete professional growth record',
      error: error.message
    }, { status: 500 });
  }
}
