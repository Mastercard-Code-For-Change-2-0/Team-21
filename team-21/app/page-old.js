"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Award, FileText, Shield, Users, BookOpen } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const userRole = user?.publicMetadata?.role;
      
      // Redirect based on user role
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "moderator") {
        router.push("/moderator");
      } else {
        // For students or users without a role, go to student dashboard
        router.push("/student/dashboard");
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is signed in, they'll be redirected above
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Redirecting...</div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Student Management
            <span className="block text-blue-600">Portal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage your academic journey with our comprehensive student portal. 
            Complete your registration, track professional growth, and upload documents all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Sign In to Get Started
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <User className="h-6 w-6" />
                Student Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Complete your student profile with personal information, academic details, and enrollment data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Award className="h-6 w-6" />
                Professional Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Set career goals, track skill development, and plan your professional journey.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <FileText className="h-6 w-6" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Securely upload and manage your academic transcripts, certificates, and marksheets.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Users className="h-6 w-6" />
                Moderator Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Review student submissions, provide feedback, and manage academic processes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-6 w-6" />
                Admin Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Comprehensive system administration, user management, and analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <BookOpen className="h-6 w-6" />
                Progress Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Monitor your academic progress and completion status across all required forms.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to access your personalized dashboard and begin managing your academic journey.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Sign In Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
              Marksheet Upload
            </Button>
            <Button
              variant={activeForm === "admin" ? "default" : "outline"}
              onClick={() => setActiveForm("admin")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "admin" 
                  ? "bg-red-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Admin Dashboard
            </Button>
            <Button
              variant={activeForm === "moderator" ? "default" : "outline"}
              onClick={() => setActiveForm("moderator")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "moderator" 
                  ? "bg-orange-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Moderator Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="pt-0">
        {activeForm === "student" && <StudentForm />}
        {activeForm === "professional" && <ProfessionalGrowthForm />}
        {activeForm === "marksheet" && <MarksheetForm />}
        {activeForm === "admin" && <AdminDashboard />}
        {activeForm === "moderator" && <ModeratorDashboard />}
      </div>
    </main>
  );
}
