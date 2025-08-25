import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from "@/lib/models/User";

// GET - Get all mentors
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    await connectDB();

    // Build query
    let query = { role: 'mentor' };
    
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated results
    const mentors = await User.find(query)
      .select('-password_hash')
      .populate('assigned_students', 'full_name student_code placement_status')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: mentors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch mentors error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    }, { status: 500 });
  }
}

// POST - Create new mentor
export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();
    

    // Create mentor user
    const mentorData = {
      ...data,
      role: 'mentor',
      status: 'active',
      assigned_students: []
    };

    const mentor = await User.create(mentorData);

    return NextResponse.json({
      success: true,
      message: 'Mentor created successfully',
      data: {
        id: mentor._id,
        username: mentor.username,
        email: mentor.email,
        full_name: mentor.full_name
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create mentor error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `${field} already exists`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create mentor',
      error: error.message
    }, { status: 500 });
  }
}
