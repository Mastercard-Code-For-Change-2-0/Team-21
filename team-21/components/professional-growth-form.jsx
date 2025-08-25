"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  // Current Organization
  currentOrganization: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  currentRole: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  currentJoinDate: z.string().min(1, {
    message: "Please select when you joined the organization.",
  }),
  
  // Past Experience
  pastOrganization: z.string().optional(),
  pastRole: z.string().optional(),
  pastJoinDate: z.string().optional(),
  pastLeaveDate: z.string().optional(),
  
  // Growth Questions
  professionalChallenge: z.string().min(50, {
    message: "Please describe your challenge in at least 50 characters.",
  }),
  newSkills: z.string().min(50, {
    message: "Please describe your new skills in at least 50 characters.",
  }),
  handleCriticism: z.string().min(50, {
    message: "Please describe how you handle criticism in at least 50 characters.",
  }),
  teamCollaboration: z.string().min(50, {
    message: "Please describe your team collaboration experience in at least 50 characters.",
  }),
  careerGoals: z.string().min(50, {
    message: "Please describe your career goals in at least 50 characters.",
  }),
  workCultureContribution: z.string().min(50, {
    message: "Please describe your contributions in at least 50 characters.",
  }),
  stayUpdated: z.string().min(50, {
    message: "Please describe how you stay updated in at least 50 characters.",
  }),
})

export function ProfessionalGrowthForm() {
  const router = useRouter()
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentOrganization: "",
      currentRole: "",
      currentJoinDate: "",
      pastOrganization: "",
      pastRole: "",
      pastJoinDate: "",
      pastLeaveDate: "",
      professionalChallenge: "",
      newSkills: "",
      handleCriticism: "",
      teamCollaboration: "",
      careerGoals: "",
      workCultureContribution: "",
      stayUpdated: "",
    },
  })

  function onSubmit(values) {
    console.log(values)
    // Here you would typically send the data to your backend for LLM-as-a-judge evaluation
    alert("Professional Growth Form submitted successfully! Redirecting to Marksheet Upload...")
    // Redirect to marksheet upload form
    router.push("/student/marksheet")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Professional Growth Form</h1>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Share your professional journey and growth experiences
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Current Organization Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Organization</h2>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currentOrganization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Current Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your current organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Role in Current Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your current role/position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentJoinDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When Did You Join the Organization</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Past Experience Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Past Experience (Optional)</h2>
                <p className="text-sm text-gray-600 mb-4">If you have previous work experience, please fill out this section</p>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pastOrganization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name of Past Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter past organization name (if applicable)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pastRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role in Past Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your past role/position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pastJoinDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When Did You Join Past Organization</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pastLeaveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>When Did You Leave Past Organization</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Growth Questions Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Growth Questions</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please provide detailed responses. These will be evaluated for quality and depth of insight.
                </p>
                
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="professionalChallenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe a major professional challenge you've overcome in the last year</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the challenge, how you approached it, and the outcome..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide specific details about the situation, your actions, and results
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What new skills have you acquired recently and how did you apply them?</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the skills you learned and practical applications..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include both technical and soft skills with examples of application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="handleCriticism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How do you handle constructive criticism and feedback?</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your approach to receiving and acting on feedback..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Share your mindset and process for handling feedback
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamCollaboration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe a time you collaborated effectively with a team to achieve a goal</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the team project, your role, and the successful outcome..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Focus on your specific contributions and team dynamics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="careerGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your career goals for the next three years?</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Outline your short and medium-term career objectives..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include specific roles, skills, or achievements you're targeting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workCultureContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How have you contributed to a positive work culture?</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Share examples of how you've positively impacted your workplace culture..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include initiatives, behaviors, or attitudes that made a difference
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stayUpdated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you do to stay updated in your field?</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your learning habits, resources, and continuous improvement practices..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include courses, reading, networking, or other learning activities
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Navigation and Submit Buttons */}
              <div className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/student")}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Back to Registration
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/student/dashboard")}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Back to Dashboard
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                >
                  Submit & Continue to Marksheet Upload
                </Button>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Your responses will be evaluated for depth, clarity, and professional insight
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
