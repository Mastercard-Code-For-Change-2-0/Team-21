"use client";

import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import Link from "next/link";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on student pages as they have their own navigation
  if (pathname?.startsWith('/student')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Card className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 border-0">
            <GraduationCap className="h-6 w-6 text-white" />
          </Card>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">Team 21</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Join thousands of students</span>
              </div>
            </div>
            <Button size="lg" className="rounded-full shadow-lg" asChild>
              <SignInButton className="cursor-pointer" mode="modal" />
            </Button>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
          
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
