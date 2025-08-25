"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ModeratorDashboard } from "@/components/moderator-dashboard";

export default function ModeratorPage() {
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

  // Check if user has moderator role
  const userRole = user?.publicMetadata?.role;
  if (userRole !== "moderator" && userRole !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="pt-8">
        <ModeratorDashboard />
      </div>
    </main>
  );
}
