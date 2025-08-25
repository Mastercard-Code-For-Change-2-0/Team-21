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

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on student pages as they have their own navigation
  if (pathname?.startsWith('/student')) {
    return null;
  }

  return (
    <header className="flex justify-end items-center pt-8 pr-4 gap-4 h-16">
      <SignedOut>
        <Button size="lg" className="rounded-full" asChild>
          <SignInButton className="cursor-pointer" mode="modal" />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
    </header>
  );
}
