"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  User, 
  Award, 
  FileText, 
  Shield, 
  Users, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle
} from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // If user is signed in, they'll be redirected above
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse rounded-full h-8 w-8 bg-primary/20"></div>
          <p className="text-lg text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Mastercard Code for Change 2.0
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Student Management
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Portal
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Empower your academic journey with our comprehensive student portal. 
            Complete registration, track professional growth, and manage documents seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg group" asChild>
              <Link href="#features">
                Explore Features 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg" asChild>
              <Link href="#about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20">
          <Card className="text-center p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
              <p className="text-sm text-muted-foreground">Students Registered</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
              <p className="text-sm text-muted-foreground">Portal Access</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to support your academic and professional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  Student Registration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Complete your student profile with personal information, academic details, and enrollment data in a streamlined process.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Quick & Easy Setup</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                  Professional Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Set career goals, track skill development, and plan your professional journey with guided assessments.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Goal Tracking</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                  Document Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Upload and manage academic documents including marksheets, certificates, and transcripts securely.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Secure Storage</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Comprehensive admin tools for managing users, monitoring progress, and generating reports.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Full Control</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                  Mentorship Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Connect with mentors and participate in guided learning programs designed for your success.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Expert Guidance</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-teal-600 transition-colors">
                  Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Detailed analytics and insights to track your academic progress and career development.
                </CardDescription>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Data Insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section id="about" className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl">
          <div className="max-w-4xl mx-auto px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Academic Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join thousands of students who are already using our platform to manage their academic progress, 
              professional growth, and career development. Start your journey today.
            </p>
            <Button size="lg" className="rounded-full px-12 py-6 text-lg shadow-lg" asChild>
              <Link href="/sign-up">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
