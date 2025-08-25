import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getModels } from '@/lib/models/User';

// POST - Upload marksheet/document
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, document_type, file_url, file_name } = data;

    const connection = await connectDB();
    const { User } = getModels(connection);

    // Find user and add marksheet record
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Add new marksheet record
    const newMarksheet = {
      document_type,
      file_url,
      file_name,
      upload_date: new Date(),
      verified: false
    };

    user.marksheets.push(newMarksheet);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: user.marksheets[user.marksheets.length - 1]
    }, { status: 201 });

  } catch (error) {
    console.error('Upload marksheet error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Get marksheets/documents
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const documentType = searchParams.get('documentType');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const connection = await connectDB();
    const { User } = getModels(connection);

    if (userId) {
      // Get specific user's documents
      const user = await User.findById(userId).select('marksheets full_name email');
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 });
      }

      let marksheets = user.marksheets;

      // Apply filters
      if (documentType) {
        marksheets = marksheets.filter(doc => doc.document_type === documentType);
      }
      if (verified !== null && verified !== undefined) {
        marksheets = marksheets.filter(doc => doc.verified === (verified === 'true'));
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email
          },
          documents: marksheets
        }
      });
    } else {
      // Get all documents with pagination
      let query = { 'marksheets.0': { $exists: true } };
      
      const users = await User.find(query)
        .select('full_name email marksheets')
        .sort({ updated_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await User.countDocuments(query);

      return NextResponse.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

  } catch (error) {
    console.error('Get marksheets error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    }, { status: 500 });
  }
}
