import { currentUser } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET() {
  try {
    // Check if user is authenticated
    const user = await currentUser()
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to database
    await connectDB()

    // Find user in database
    const dbUser = await User.findOne({ clerkId: user.id })
    
    if (!dbUser) {
      // Return basic data from Clerk if user doesn't exist in DB
      return Response.json({
        success: true,
        data: {
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.emailAddresses[0]?.emailAddress || '',
          // Other fields will be empty for new registration
        }
      })
    }

    // Return existing user data
    return Response.json({
      success: true,
      data: {
        // Registration data
        full_name: dbUser.full_name,
        email: dbUser.email,
        phone_number: dbUser.phone,  // Fixed field mapping
        date_of_birth: dbUser.dob,   // Fixed field mapping
        gender: dbUser.gender,
        address: dbUser.address,
        employment_status: dbUser.employment_status,
        father_occupation: dbUser.father_occupation,
        mother_occupation: dbUser.mother_occupation,
        
        // Professional growth data
        professional_growth: dbUser.professional_growth || [],
        
        // Marksheet data
        institution_name: dbUser.college_name,  // Map college_name to institution_name
        degree_program: dbUser.education_level, // Map education_level to degree_program
        graduation_year: dbUser.graduation_year,
        cgpa_percentage: dbUser.cgpa_percentage,
        marksheet_file: dbUser.marksheet_file
      }
    })

  } catch (error) {
    console.error('Error fetching user data:', error)
    return Response.json(
      { error: 'Failed to fetch user data' }, 
      { status: 500 }
    )
  }
}
