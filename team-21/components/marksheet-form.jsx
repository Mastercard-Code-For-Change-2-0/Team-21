"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Upload, File, X } from "lucide-react"

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

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

const fileValidation = z
  .any()
  .refine((files) => {
    // Check if files exists and has length (FileList or array-like)
    return files && files.length > 0;
  }, "File is required.")
  .refine((files) => {
    // Check file size
    return files && files[0]?.size <= MAX_FILE_SIZE;
  }, "File size should be less than 5MB.")
  .refine((files) => {
    // Check file type
    return files && ACCEPTED_FILE_TYPES.includes(files[0]?.type);
  }, "Only PDF, JPEG, and PNG files are accepted.");

const optionalFileValidation = z
  .any()
  .optional()
  .refine((files) => {
    // If no files, it's valid (optional)
    if (!files || files.length === 0) return true;
    // If files exist, check size
    return files[0]?.size <= MAX_FILE_SIZE;
  }, "File size should be less than 5MB.")
  .refine((files) => {
    // If no files, it's valid (optional)
    if (!files || files.length === 0) return true;
    // If files exist, check type
    return ACCEPTED_FILE_TYPES.includes(files[0]?.type);
  }, "Only PDF, JPEG, and PNG files are accepted.");

const formSchema = z.object({
  tenthMarksheet: fileValidation,
  twelfthMarksheet: fileValidation,
  highestDegreeMarksheet: fileValidation,
  certificationCourse1: optionalFileValidation,
  certificationCourse2: optionalFileValidation,
})

export function MarksheetForm() {
  const [uploadedFiles, setUploadedFiles] = useState({
    tenthMarksheet: null,
    twelfthMarksheet: null,
    highestDegreeMarksheet: null,
    certificationCourse1: null,
    certificationCourse2: null,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values) {
    console.log("Form values:", values)
    console.log("Uploaded files:", uploadedFiles)
    // Here you would typically upload files to your server
    alert("Marksheet form submitted successfully!")
  }

  const handleFileChange = (fieldName, files) => {
    if (files && files.length > 0) {
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: files[0]
      }))
    }
  }

  const removeFile = (fieldName) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: null
    }))
    // Reset the form field to undefined instead of new FileList()
    form.setValue(fieldName, undefined)
  }

  const FileUploadField = ({ name, label, description, required = true }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      onChange(e.target.files)
                      handleFileChange(name, e.target.files)
                    }}
                    {...field}
                  />
                </label>
              </div>
              
              {uploadedFiles[name] && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {uploadedFiles[name].name}
                      </p>
                      <p className="text-xs text-blue-700">
                        {(uploadedFiles[name].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(name)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Marksheet Upload Form</h1>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please upload your academic documents and certifications
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Academic Marksheets Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Marksheets</h2>
                
                <div className="space-y-8">
                  <FileUploadField
                    name="tenthMarksheet"
                    label="10th Marksheet"
                    description="Upload your 10th standard/grade marksheet or certificate"
                    required={true}
                  />

                  <FileUploadField
                    name="twelfthMarksheet"
                    label="12th Marksheet"
                    description="Upload your 12th standard/grade marksheet or certificate"
                    required={true}
                  />

                  <FileUploadField
                    name="highestDegreeMarksheet"
                    label="Highest Degree of Education Marksheet"
                    description="Upload your highest degree marksheet (if 12th is your highest, upload 12th marksheet again)"
                    required={true}
                  />
                </div>
              </div>

              {/* Certification Courses Section */}
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Certification Courses (Optional)</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Upload any relevant certification courses you have completed
                </p>
                
                <div className="space-y-8">
                  <FileUploadField
                    name="certificationCourse1"
                    label="Certification Course 1"
                    description="Upload your first certification course certificate (if applicable)"
                    required={false}
                  />

                  <FileUploadField
                    name="certificationCourse2"
                    label="Certification Course 2"
                    description="Upload your second certification course certificate (if applicable)"
                    required={false}
                  />
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notes:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Maximum file size: 5MB per document</li>
                  <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                  <li>• Ensure documents are clear and readable</li>
                  <li>• All academic marksheets are mandatory</li>
                  <li>• Certification courses are optional but recommended</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                >
                  Submit Marksheet Form
                </Button>
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Please ensure all required documents are uploaded before submitting
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
