import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isModeratorRoute = createRouteMatcher(['/moderator(.*)'])
const isStudentRoute = createRouteMatcher(['/student(.*)'])
const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/moderator(.*)', '/student(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata?.role

  // If trying to access a protected route but not logged in, redirect to home
  if (isProtectedRoute(req) && !userId) {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // Protect admin routes - only admins can access
  if (isAdminRoute(req) && userRole !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // Protect moderator routes - only moderators and admins can access
  if (isModeratorRoute(req) && userRole !== 'moderator' && userRole !== 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }

  // Student routes are accessible to all authenticated users
  // This allows students (users without specific roles) to access student routes
  if (isStudentRoute(req) && !userId) {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ],
};