"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Home } from "lucide-react";

export default function StudentLayout({ children }) {
  const { isSignedIn, isLoaded } = useUser();

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

  // Mock progress data - in real app, this would come from your database
  const steps = [
    {
      id: 1,
      title: "Student Registration",
      href: "/student",
      completed: true, // Mock data
      current: false
    },
    {
      id: 2,
      title: "Professional Growth",
      href: "/student/professional-growth",
      completed: false, // Mock data
      current: false
    },
    {
      id: 3,
      title: "Marksheet Upload",
      href: "/student/marksheet",
      completed: false, // Mock data
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href="/student/dashboard">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <Link href={step.href} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : step.current
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.completed || step.current 
                        ? 'text-gray-900' 
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    {step.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                </Link>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-4 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
