"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock, FileText, User, BookOpen, Award } from "lucide-react";

export default function StudentDashboard() {
  const { isSignedIn, isLoaded, user } = useUser();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to home if not signed in
  if (!isSignedIn) {
    redirect("/");
  }

  // Mock data for demo - in real app, this would come from your database
  const studentProgress = {
    registration: { completed: true, date: "2024-01-15" },
    professionalGrowth: { completed: true, date: "2024-01-18" },
    marksheet: { completed: false, date: null }
  };

  const stats = [
    { title: "Forms Completed", value: "2/3", icon: FileText, color: "bg-blue-500" },
    { title: "Profile Completion", value: "85%", icon: User, color: "bg-green-500" },
    { title: "Current Status", value: "Active", icon: CheckCircle, color: "bg-emerald-500" },
    { title: "Academic Year", value: "2024-25", icon: BookOpen, color: "bg-purple-500" }
  ];

  const quickActions = [
    {
      title: "Update Registration",
      description: "Modify your registration details",
      href: "/student",
      icon: User,
      color: "border-blue-200 hover:border-blue-300"
    },
    {
      title: "Professional Growth",
      description: "Complete professional development form",
      href: "/student/professional-growth",
      icon: Award,
      color: "border-green-200 hover:border-green-300"
    },
    {
      title: "Upload Marksheet",
      description: "Upload your academic marksheet",
      href: "/student/marksheet",
      icon: FileText,
      color: "border-purple-200 hover:border-purple-300"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "Student"}!
          </h1>
          <p className="text-gray-600">
            Track your progress and manage your academic information
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Tracking */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Form Completion Progress
                </CardTitle>
                <CardDescription>
                  Track your progress through required forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${studentProgress.registration.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Student Registration</h4>
                        <p className="text-sm text-gray-600">Basic information and enrollment details</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {studentProgress.registration.completed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${studentProgress.professionalGrowth.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Professional Growth Form</h4>
                        <p className="text-sm text-gray-600">Career goals and development plans</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {studentProgress.professionalGrowth.completed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${studentProgress.marksheet.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">Marksheet Upload</h4>
                        <p className="text-sm text-gray-600">Academic transcripts and certificates</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {studentProgress.marksheet.completed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your forms and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${action.color} bg-white hover:shadow-md`}>
                      <div className="flex items-center gap-3">
                        <action.icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Professional Growth Form submitted</p>
                    <p className="text-xs text-gray-600">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <div className="p-1 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Student registration completed</p>
                    <p className="text-xs text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
