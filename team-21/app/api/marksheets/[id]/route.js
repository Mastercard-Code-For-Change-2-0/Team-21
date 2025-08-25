import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from "@/lib/models/User";

// PUT - Update document verification status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { userId, verified } = data;

    await connectDB();
    

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Find and update the specific document
    const docIndex = user.marksheets.findIndex(
      doc => doc._id.toString() === id
    );

    if (docIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Document not found'
      }, { status: 404 });
    }

    // Update verification status
    user.marksheets[docIndex].verified = verified;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Document ${verified ? 'verified' : 'unverified'} successfully`,
      data: user.marksheets[docIndex]
    });

  } catch (error) {
    console.error('Update document verification error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update document verification',
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete document
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

    // Remove the specific document
    const initialLength = user.marksheets.length;
    user.marksheets = user.marksheets.filter(
      doc => doc._id.toString() !== id
    );

    if (user.marksheets.length === initialLength) {
      return NextResponse.json({
        success: false,
        message: 'Document not found'
      }, { status: 404 });
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    }, { status: 500 });
  }
}
