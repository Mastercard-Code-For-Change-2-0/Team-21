"use client"

import { useState } from "react";
import { StudentForm } from "@/components/student-form";
import { ProfessionalGrowthForm } from "@/components/professional-growth-form";
import { MarksheetForm } from "@/components/marksheet-form";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ModeratorDashboard } from "@/components/moderator-dashboard";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeForm, setActiveForm] = useState("student");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Form Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            <Button
              variant={activeForm === "student" ? "default" : "outline"}
              onClick={() => setActiveForm("student")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "student" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Student Registration
            </Button>
            <Button
              variant={activeForm === "professional" ? "default" : "outline"}
              onClick={() => setActiveForm("professional")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "professional" 
                  ? "bg-green-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Professional Growth
            </Button>
            <Button
              variant={activeForm === "marksheet" ? "default" : "outline"}
              onClick={() => setActiveForm("marksheet")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "marksheet" 
                  ? "bg-purple-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Marksheet Upload
            </Button>
            <Button
              variant={activeForm === "admin" ? "default" : "outline"}
              onClick={() => setActiveForm("admin")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "admin" 
                  ? "bg-red-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Admin Dashboard
            </Button>
            <Button
              variant={activeForm === "moderator" ? "default" : "outline"}
              onClick={() => setActiveForm("moderator")}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeForm === "moderator" 
                  ? "bg-orange-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Moderator Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="pt-0">
        {activeForm === "student" && <StudentForm />}
        {activeForm === "professional" && <ProfessionalGrowthForm />}
        {activeForm === "marksheet" && <MarksheetForm />}
        {activeForm === "admin" && <AdminDashboard />}
        {activeForm === "moderator" && <ModeratorDashboard />}
      </div>
    </main>
  );
}
