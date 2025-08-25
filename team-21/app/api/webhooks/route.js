import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';
import { UserService } from '@/lib/services/UserService';

export async function POST(req) {
  try {
    // Get the body
    const body = await req.json();
    
    // Handle the webhook without verification (for development)
    const eventType = body.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, public_metadata, image_url } = body.data;
    
    console.log('🎉 User created webhook received:');
    console.log('User ID:', id);
    console.log('Email:', email_addresses[0]?.email_address);
    console.log('Name:', first_name, last_name);
    console.log('Role from metadata:', public_metadata?.role);
    
    try {
      // Save user to MongoDB based on their role
      const userData = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        role: public_metadata?.role || 'client',
        profileImage: image_url
      };
      
      const savedUser = await UserService.createOrUpdateUser(userData);
      console.log('User saved to MongoDB:', savedUser._id);
      
    } catch (error) {
      console.error('Error saving user to MongoDB:', error);
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, public_metadata, image_url } = body.data;
    
    console.log('User updated webhook received:');
    console.log('User ID:', id);
    console.log('Updated metadata:', public_metadata);
    
    try {
      // Update user in MongoDB
      const userData = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        role: public_metadata?.role || 'client',
        profileImage: image_url
      };
      
      const updatedUser = await UserService.createOrUpdateUser(userData);
      console.log('User updated in MongoDB:', updatedUser._id);
      
    } catch (error) {
      console.error('Error updating user in MongoDB:', error);
    }
  }

  return new Response('', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}
