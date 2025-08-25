"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProfessionalGrowthForm } from "@/components/professional-growth-form";

export default function ProfessionalGrowthPage() {
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="pt-8">
        <ProfessionalGrowthForm />
      </div>
    </main>
  );
}
