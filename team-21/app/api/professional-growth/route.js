import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST - Add professional growth record
export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, ...growthData } = data;

    await connectDB();

    // Find user and add professional growth record
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Add new professional growth record
    const newGrowthRecord = {
      ...growthData,
      start_date: new Date(growthData.start_date),
      end_date: growthData.end_date ? new Date(growthData.end_date) : null
    };

    user.professional_growth.push(newGrowthRecord);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Professional growth record added successfully',
      data: user.professional_growth[user.professional_growth.length - 1]
    }, { status: 201 });

  } catch (error) {
    console.error('Add professional growth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add professional growth record',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Fetch professional growth records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    await connectDB();

    if (userId) {
      // Get specific user's records
      const user = await User.findById(userId).select('professional_growth full_name email');
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id,
            full_name: user.full_name,
            email: user.email
          },
          records: user.professional_growth
        }
      });
    } else {
      // Get all records with pagination
      const users = await User.find({ 
        role: 'student',
        'professional_growth.0': { $exists: true }
      })
      .select('full_name email professional_growth')
      .sort({ updated_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

      const total = await User.countDocuments({ 
        role: 'student',
        'professional_growth.0': { $exists: true }
      });

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
    console.error('Get professional growth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch professional growth records',
      error: error.message
    }, { status: 500 });
  }
}
