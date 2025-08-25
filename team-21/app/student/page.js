"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { StudentForm } from "@/components/student-form";

export default function StudentRegistrationPage() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-8">
        <StudentForm />
      </div>
    </main>
  );
}
