"use client"
// app/dashboard/application/page.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ApplicationFormValues, applicationFormSchema } from "./schema"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

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
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { countries } from "@/lib/constants/countries"

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
const STUDY_LEVELS = ["High School", "Undergraduate", "Graduate", "Doctorate", "Other"]
const TECHNICAL_SKILLS = [
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Data Science",
  "Cybersecurity",
  "UI/UX Design",
  "Game Development",
  "Cloud Computing",
  "DevOps",
  "Blockchain",
]
const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Swift",
  "Go",
  "Rust",
  "TypeScript",
]
const ETHNICITIES = [
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native American",
  "Pacific Islander",
  "White",
  "Other",
  "Prefer not to say",
]

const currentYear = new Date().getFullYear()
const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [existingApplication, setExistingApplication] = useState<ApplicationFormValues | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      phone_number: null,
      address: null,
      citizenship: null,
      technical_skills: [],
      programming_languages: [],
      ethnicity: [],
      is_student: false,
      school: null,
      study_level: null,
      graduation_year: null,
      major: null,
      attended_mlh: false,
      hackathon_experience: false,
      hackathon_experience_desc: null,
      has_team: false,
      needs_teammates: false,
      desired_teammate_skills: null,
      goals: null,
      heard_from: null,
      needs_sponsorship: false,
      accessibility_needs: false,
      accessibility_desc: null,
      dietary_restrictions: false,
      dietary_desc: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      emergency_contact_relation: null,
      tshirt_size: null,
      underrepresented: false,
      mlh_code_of_conduct: false,
      mlh_data_sharing: false,
      mlh_communications: false,
      info_accurate: false,
      understands_admission: false,
    },
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending navigation
      router.prefetch('/dashboard')
    }
  }, [router])

  // Check for existing application
  useEffect(() => {
    async function checkExistingApplication() {
      setIsLoading(true)
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) throw new Error("User not found")

        const { data: application, error: applicationError } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (applicationError && applicationError.code !== 'PGRST116') {
          throw applicationError
        }

        if (application) {
          setExistingApplication(application)
          form.reset(application)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load application data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkExistingApplication()
  }, [form])

  const onSubmit = async (values: ApplicationFormValues) => {
    if (existingApplication) {
      toast({
        title: "Application Already Exists",
        description: "You have already submitted an application.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      
      if (userError || !user) throw new Error("User not found")

      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value.trim() === '' ? null : value.trim()
        } 
        else if (Array.isArray(value)) {
          acc[key] = value.length === 0 ? [] : value
        }
        else {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>)

      if (cleanedValues.graduation_year) {
        cleanedValues.graduation_year = parseInt(cleanedValues.graduation_year as string)
      }

      const { error: submitError } = await supabase
        .from("applications")
        .upsert([
          {
            user_id: user.id,
            ...cleanedValues,
            status: "Under Review",
            updated_at: new Date().toISOString(),
          } as ApplicationFormValues,
        ])

      if (submitError) throw submitError

      toast({
        title: "Application Submitted Successfully!",
        description: "You can track its status in your dashboard.",
        variant: "default",
        duration: 3000,
      })

      router.replace("/dashboard")
    } catch (error: any) {
      if (error?.code === '23505') {
        toast({
          title: "Duplicate Application",
          description: "You have already submitted an application.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading application data...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">RocketHacks Application</h1>
          {existingApplication ? (
            <p className="text-muted-foreground">
              Your application has been submitted and is {(existingApplication?.status ?? "under review").toLowerCase()}.
            </p>
          ) : (
            <p className="text-muted-foreground">
              Please fill out all required fields in the application form below.
            </p>
          )}
        </div>

        {existingApplication ? (
          // Show read-only view of the application
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Phone Number</h3>
                  <p className="text-muted-foreground">{existingApplication.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">{existingApplication.address || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Citizenship</h3>
                  <p className="text-muted-foreground">{existingApplication.citizenship || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Education</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Student Status</h3>
                  <p className="text-muted-foreground">{existingApplication.is_student ? 'Current Student' : 'Not a Student'}</p>
                </div>
                <div>
                  <h3 className="font-medium">School</h3>
                  <p className="text-muted-foreground">{existingApplication.school || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Study Level</h3>
                  <p className="text-muted-foreground">{existingApplication.study_level || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Graduation Year</h3>
                  <p className="text-muted-foreground">{existingApplication.graduation_year || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Major</h3>
                  <p className="text-muted-foreground">{existingApplication.major || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Experience</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">MLH Participation</h3>
                  <p className="text-muted-foreground">{existingApplication.attended_mlh ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Technical Skills</h3>
                  <p className="text-muted-foreground">
                    {existingApplication.technical_skills.length > 0 
                      ? existingApplication.technical_skills.join(', ') 
                      : 'None provided'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Programming Languages</h3>
                  <p className="text-muted-foreground">
                    {existingApplication.programming_languages.length > 0 
                      ? existingApplication.programming_languages.join(', ') 
                      : 'None provided'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Hackathon Experience</h3>
                  <p className="text-muted-foreground">{existingApplication.hackathon_experience ? 'Yes' : 'No'}</p>
                  {existingApplication.hackathon_experience_desc && (
                    <p className="text-muted-foreground mt-2">{existingApplication.hackathon_experience_desc}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Team & Goals</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Has Team</h3>
                  <p className="text-muted-foreground">{existingApplication.has_team ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Looking for Teammates</h3>
                  <p className="text-muted-foreground">{existingApplication.needs_teammates ? 'Yes' : 'No'}</p>
                </div>
                {existingApplication.desired_teammate_skills && (
                  <div>
                    <h3 className="font-medium">Desired Teammate Skills</h3>
                    <p className="text-muted-foreground">{existingApplication.desired_teammate_skills}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">Goals</h3>
                  <p className="text-muted-foreground">{existingApplication.goals || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">How did you hear about us?</h3>
                  <p className="text-muted-foreground">{existingApplication.heard_from || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Support Needs</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Needs Sponsorship</h3>
                  <p className="text-muted-foreground">{existingApplication.needs_sponsorship ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Accessibility Needs</h3>
                  <p className="text-muted-foreground">{existingApplication.accessibility_needs ? 'Yes' : 'No'}</p>
                  {existingApplication.accessibility_desc && (
                    <p className="text-muted-foreground mt-2">{existingApplication.accessibility_desc}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Dietary Restrictions</h3>
                  <p className="text-muted-foreground">{existingApplication.dietary_restrictions ? 'Yes' : 'No'}</p>
                  {existingApplication.dietary_desc && (
                    <p className="text-muted-foreground mt-2">{existingApplication.dietary_desc}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Emergency Contact</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p className="text-muted-foreground">{existingApplication.emergency_contact_name || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">{existingApplication.emergency_contact_phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Relationship</h3>
                  <p className="text-muted-foreground">{existingApplication.emergency_contact_relation || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Additional Information</h2>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">T-Shirt Size</h3>
                  <p className="text-muted-foreground">{existingApplication.tshirt_size || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Ethnicity</h3>
                  <p className="text-muted-foreground">
                    {existingApplication.ethnicity.length > 0 
                      ? existingApplication.ethnicity.join(', ') 
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Underrepresented Group</h3>
                  <p className="text-muted-foreground">{existingApplication.underrepresented ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          // Show the form
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="citizenship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Citizenship</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your citizenship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Education</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="is_student"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Are you currently a student?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="study_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Study Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your study level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STUDY_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduation_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={new Date().getFullYear()} 
                            max={new Date().getFullYear() + 6}
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Experience</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="attended_mlh"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Have you participated in MLH events before?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Skills</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {TECHNICAL_SKILLS.map((skill) => (
                            <FormField
                              key={skill}
                              control={form.control}
                              name="technical_skills"
                              render={({ field }) => (
                                <FormItem
                                  key={skill}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, skill])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== skill
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {skill}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="programming_languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programming Languages</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Python, JavaScript, Java (comma-separated)"
                            {...field}
                            value={field.value.join(', ')}
                            onChange={(e) => {
                              const languages = e.target.value
                                .split(',')
                                .map((lang) => lang.trim())
                                .filter(Boolean)
                              field.onChange(languages)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hackathon_experience"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Do you have previous hackathon experience?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("hackathon_experience") && (
                    <FormField
                      control={form.control}
                      name="hackathon_experience_desc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tell us about your hackathon experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ''}
                              placeholder="Describe your previous hackathon experiences..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Team & Goals Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Team & Goals</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="has_team"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you already have a team?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!form.watch("has_team") && (
                    <FormField
                      control={form.control}
                      name="needs_teammates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Would you like to be matched with teammates?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("needs_teammates") && (
                    <FormField
                      control={form.control}
                      name="desired_teammate_skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What skills are you looking for in teammates?</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ''}
                              placeholder="Describe the skills you're looking for..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your goals for this hackathon?</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            value={field.value || ''}
                            placeholder="Share your goals and what you hope to achieve..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heard_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about us?</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Support Needs Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Support Needs</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="needs_sponsorship"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you need travel sponsorship?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accessibility_needs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you have any accessibility needs?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("accessibility_needs") && (
                    <FormField
                      control={form.control}
                      name="accessibility_desc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please describe your accessibility needs</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ''}
                              placeholder="Describe any accommodations you need..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="dietary_restrictions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you have any dietary restrictions?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("dietary_restrictions") && (
                    <FormField
                      control={form.control}
                      name="dietary_desc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please describe your dietary restrictions</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              value={field.value || ''}
                              placeholder="Describe your dietary restrictions..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Emergency Contact</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergency_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergency_contact_relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Emergency Contact</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Additional Information</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="tshirt_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T-Shirt Size</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your t-shirt size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TSHIRT_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="underrepresented"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Do you identify as part of an underrepresented group in tech?</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Agreements Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Agreements</h2>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="mlh_code_of_conduct"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I agree to follow the MLH Code of Conduct</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mlh_data_sharing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I agree to MLH's data sharing policy</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mlh_communications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I would like to receive communications from MLH</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="info_accurate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I confirm that all information provided is accurate</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="understands_admission"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            required
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I understand that submission does not guarantee admission</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
} 