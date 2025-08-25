"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, Users, Code, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Team 21</h3>
            <p className="text-sm text-muted-foreground">
              Student Management Portal developed for Mastercard Code for Change 2.0 initiative.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Built with passion for education</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="space-y-2">
              <Link 
                href="/student/dashboard" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Student Dashboard
              </Link>
              <Link 
                href="/student/professional-growth" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Professional Growth
              </Link>
              <Link 
                href="/student/marksheet" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload Documents
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Registration
              </li>
              <li className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Progress Tracking
              </li>
              <li className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                Document Management
              </li>
            </ul>
          </div>

          {/* Contact & Tech */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Technology</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Next.js 15.5.0</p>
              <p>React & TypeScript</p>
              <p>MongoDB & Mongoose</p>
              <p>Clerk Authentication</p>
              <p>Tailwind CSS</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="https://github.com/Mastercard-Code-For-Change-2-0/Team-21">
                <Github className="h-4 w-4 mr-2" />
                View Source
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Team 21 - Mastercard Code for Change 2.0. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Made for social impact
            </div>
            <Card className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <span className="text-xs font-medium text-orange-800 dark:text-orange-200">
                Code for Change
              </span>
            </Card>
          </div>
        </div>
      </div>
    </footer>
  );
}
