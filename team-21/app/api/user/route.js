import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const role = clerkUser.publicMetadata?.role || 'client';
    
    // Get user from MongoDB
    const mongoUser = await UserService.getUserByClerkId(clerkUser.id, role);
    
    return NextResponse.json({
      // Clerk data
      clerk: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        role: role,
        publicMetadata: clerkUser.publicMetadata,
        createdAt: clerkUser.createdAt,
      },
      // MongoDB data
      mongodb: mongoUser,
      // Status
      synced: !!mongoUser
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const role = clerkUser.publicMetadata?.role || 'client';
    
    // Create or update user in MongoDB
    const userData = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      role: role,
      profileImage: clerkUser.imageUrl
    };
    
    const mongoUser = await UserService.createOrUpdateUser(userData);
    
    return NextResponse.json({
      success: true,
      message: 'User synced to MongoDB',
      user: mongoUser
    });
    
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
