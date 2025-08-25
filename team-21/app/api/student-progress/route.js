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
      // If user doesn't exist in DB yet, return empty progress
      return Response.json({
        success: true,
        progress: {
          registration: { completed: false, date: null },
          professionalGrowth: { completed: false, date: null },
          marksheet: { completed: false, date: null }
        },
        stats: {
          formsCompleted: 0,
          totalForms: 3,
          profileCompletion: 0
        }
      })
    }

    // Calculate progress based on available data
    const progress = {
      registration: {
        completed: !!(dbUser.full_name && dbUser.email && dbUser.phone_number),
        date: dbUser.updatedAt || null
      },
      professionalGrowth: {
        completed: !!(dbUser.professional_growth && dbUser.professional_growth.length > 0),
        date: dbUser.professional_growth?.[0]?.date || null
      },
      marksheet: {
        completed: !!(dbUser.marksheet_file || dbUser.cgpa_percentage),
        date: dbUser.marksheet_upload_date || null
      }
    }

    // Calculate stats
    const completedForms = Object.values(progress).filter(p => p.completed).length
    const profileCompletion = Math.round((completedForms / 3) * 100)

    return Response.json({
      success: true,
      progress,
      stats: {
        formsCompleted: completedForms,
        totalForms: 3,
        profileCompletion
      },
      user: {
        name: dbUser.full_name || user.firstName,
        email: dbUser.email || user.emailAddresses[0]?.emailAddress,
        role: dbUser.role || 'student'
      }
    })

  } catch (error) {
    console.error('Error fetching student progress:', error)
    return Response.json(
      { error: 'Failed to fetch progress data' }, 
      { status: 500 }
    )
  }
}
