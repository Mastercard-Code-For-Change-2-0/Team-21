import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { currentUser } from '@clerk/nextjs/server';

// POST - Add marksheet record (for now, just save metadata - file upload would need additional setup)
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

    // Find user
    const userData = await User.findOne({ clerkId: user.id });
    if (!userData) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Create marksheet records (in a real app, you'd handle file uploads here)
    const marksheetRecords = [];
    
    // Add required marksheets
    if (data.tenthMarksheet) {
      marksheetRecords.push({
        document_type: '10th',
        file_name: 'tenth_marksheet.pdf', // In reality, this would be the uploaded file name
        file_url: '/uploads/tenth_marksheet.pdf', // In reality, this would be the uploaded file URL
        upload_date: new Date(),
        verified: false
      });
    }

    if (data.twelfthMarksheet) {
      marksheetRecords.push({
        document_type: '12th',
        file_name: 'twelfth_marksheet.pdf',
        file_url: '/uploads/twelfth_marksheet.pdf',
        upload_date: new Date(),
        verified: false
      });
    }

    if (data.highestDegreeMarksheet) {
      marksheetRecords.push({
        document_type: 'Graduation',
        file_name: 'graduation_marksheet.pdf',
        file_url: '/uploads/graduation_marksheet.pdf',
        upload_date: new Date(),
        verified: false
      });
    }

    // Add optional certifications
    if (data.certificationCourse1) {
      marksheetRecords.push({
        document_type: 'Certificate',
        file_name: 'certification_1.pdf',
        file_url: '/uploads/certification_1.pdf',
        upload_date: new Date(),
        verified: false
      });
    }

    if (data.certificationCourse2) {
      marksheetRecords.push({
        document_type: 'Certificate',
        file_name: 'certification_2.pdf',
        file_url: '/uploads/certification_2.pdf',
        upload_date: new Date(),
        verified: false
      });
    }

        // Update user with academic information and marksheet data
    const updateData = {
      // Save basic academic information
      institution_name: data.institutionName,
      degree_program: data.degreeProgram,
      graduation_year: data.graduationYear,
      cgpa_percentage: data.cgpaPercentage,
      marksheet_upload_date: new Date(),
      
      // Add marksheet records to existing array
      $push: {
        marksheets: { $each: marksheetRecords }
      }
    };

    await User.findByIdAndUpdate(userData._id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Marksheet information uploaded successfully',
      data: {
        academicInfo: {
          institution: data.institutionName,
          degree: data.degreeProgram,
          graduationYear: data.graduationYear,
          cgpa: data.cgpaPercentage
        },
        marksheets: marksheetRecords.length,
        uploadedFiles: marksheetRecords.map(m => m.document_type)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Marksheet upload error:', error);
    
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
      message: 'Failed to add marksheet records',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Get current user's marksheet records
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

    const userData = await User.findOne({ clerkId: user.id })
      .select('marksheets full_name email');

    if (!userData) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userData._id,
          full_name: userData.full_name,
          email: userData.email
        },
        marksheets: userData.marksheets
      }
    });

  } catch (error) {
    console.error('Get marksheets error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch marksheet records',
      error: error.message
    }, { status: 500 });
  }
}
