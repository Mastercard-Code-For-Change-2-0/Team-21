"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Calendar, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react"

const formSchema = z.object({
  studentId: z.string()
    .regex(/^Y4D[0-9]K[0-9]{5}$/, {
      message: "Student ID must follow the format Y4D_K_____ (e.g., Y4D2K25395)",
    }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Please select your date of birth.",
  }),
  gender: z.string().min(1, {
    message: "Please select your gender.",
  }),
  phone: z.string()
    .regex(/^[0-9]{10,12}$/, {
      message: "Phone number must be 10-12 digits only.",
    }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  employmentStatus: z.string().min(1, {
    message: "Please select your employment status.",
  }),
  fatherOccupation: z.string().min(2, {
    message: "Father's occupation must be at least 2 characters.",
  }),
  motherOccupation: z.string().min(2, {
    message: "Mother's occupation must be at least 2 characters.",
  }),
  highestDegree: z.string().min(1, {
    message: "Please select your highest degree of education.",
  }),
  cgpaPercentage: z.string().min(1, {
    message: "Please enter your CGPA/Percentage.",
  }),
  universityName: z.string().min(2, {
    message: "University name must be at least 2 characters.",
  }),
})

export function StudentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      name: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      address: "",
      employmentStatus: "",
      fatherOccupation: "",
      motherOccupation: "",
      highestDegree: "",
      cgpaPercentage: "",
      universityName: "",
    },
  })

  // Fetch existing user data to pre-populate form
  useEffect(() => {
    fetch('/api/user-data')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          const userData = data.data
          form.reset({
            studentId: userData.student_id || "",
            name: userData.full_name || "",
            dateOfBirth: userData.date_of_birth || "",
            gender: userData.gender || "",
            phone: userData.phone_number || "",
            address: userData.address || "",
            employmentStatus: userData.employment_status || "",
            fatherOccupation: userData.father_occupation || "",
            motherOccupation: userData.mother_occupation || "",
            highestDegree: userData.degree_program || "",
            cgpaPercentage: userData.cgpa_percentage || "",
            universityName: userData.institution_name || "",
          })
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching user data:', error)
        setLoading(false)
      })
  }, [])

  function onSubmit(values) {
    console.log(values)
    
    // Save to database
    fetch('/api/student-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Registration submitted successfully! Redirecting to Professional Growth Form...")
        // Redirect to professional growth form
        router.push("/student/professional-growth")
      } else {
        // Show detailed error messages
        let errorMessage = data.message;
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage += '\n\nValidation errors:\n' + data.errors.join('\n');
        }
        alert(`Error: ${errorMessage}`)
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Failed to submit registration. Please try again.')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              Student Registration
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Complete your profile to get started on your academic journey
            </CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto mt-4">
              Step 1 of 3
            </Badge>
          </CardHeader>

          <CardContent className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-lg text-muted-foreground">Loading your information...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information Section */}
                  <Card className="border-0 bg-muted/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Student ID</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Y4D_K_____ (e.g., Y4D2K25395)" 
                                className="text-base"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your student ID in the format Y4D_K_____ (e.g., Y4D2K25395)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date of Birth
                              </FormLabel>
                              <FormControl>
                                <Input type="date" className="text-base" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="text-base">
                                    <SelectValue placeholder="Select your gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your phone number" 
                                  className="text-base"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter 10-12 digits only
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your complete address" 
                                className="text-base"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Employment & Family Information */}
                  <Card className="border-0 bg-muted/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        Employment & Family Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">{/* ... rest of form sections ... */}
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Employment & Family Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment & Family Information</h2>
                
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="self-employed">Self-employed</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="fatherOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Occupation</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter father's occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Occupation</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mother's occupation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Educational Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Educational Information</h2>
                
                <FormField
                  control={form.control}
                  name="highestDegree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Degree of Education Completed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your highest degree" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="cgpaPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA / Percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter CGPA or Percentage" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your CGPA (e.g., 8.5) or Percentage (e.g., 85%)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="universityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter university name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Last university you studied in
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Navigation and Submit Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/student/dashboard")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Submit & Continue to Professional Growth
                </Button>
              </div>
            </form>
          </Form>
          )}
        </div>
      </div>
    </div>
  )
}