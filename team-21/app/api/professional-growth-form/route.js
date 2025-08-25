import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { currentUser } from '@clerk/nextjs/server';

// POST - Add professional growth record
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

    // Create professional growth record
    const professionalGrowthData = {
      current_organization: data.currentOrganization,
      current_role: data.currentRole,
      current_join_date: data.currentJoinDate ? new Date(data.currentJoinDate) : null,
      past_organization: data.pastOrganization || null,
      past_role: data.pastRole || null,
      past_join_date: data.pastJoinDate ? new Date(data.pastJoinDate) : null,
      past_leave_date: data.pastLeaveDate ? new Date(data.pastLeaveDate) : null,
      professional_challenge: data.professionalChallenge,
      new_skills: data.newSkills,
      handle_criticism: data.handleCriticism,
      team_collaboration: data.teamCollaboration,
      career_goals: data.careerGoals,
      work_culture_contribution: data.workCultureContribution,
      stay_updated: data.stayUpdated,
      submission_date: new Date()
    };

    // Update user with professional growth data
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        $push: { professional_growth: professionalGrowthData },
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Professional growth record added successfully',
      data: {
        id: updatedUser._id,
        professional_growth_count: updatedUser.professional_growth.length
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Professional growth error:', error);
    
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
      message: 'Failed to add professional growth record',
      error: error.message
    }, { status: 500 });
  }
}

// GET - Get current user's professional growth records
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
      .select('professional_growth full_name email');

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
        records: userData.professional_growth
      }
    });

  } catch (error) {
    console.error('Get professional growth error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch professional growth records',
      error: error.message
    }, { status: 500 });
  }
}
