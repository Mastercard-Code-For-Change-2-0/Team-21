"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MarksheetForm } from "@/components/marksheet-form";

export default function MarksheetUploadPage() {
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="pt-8">
        <MarksheetForm />
      </div>
    </main>
  );
}
