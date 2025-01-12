"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ApplicationFormValues, applicationFormSchema } from "./schema"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      technical_skills: [],
      programming_languages: [],
      ethnicity: [],
      is_student: false,
      attended_mlh: false,
      hackathon_experience: false,
      has_team: false,
      needs_teammates: false,
      needs_sponsorship: false,
      accessibility_needs: false,
      dietary_restrictions: false,
      underrepresented: false,
      mlh_code_of_conduct: false,
      mlh_data_sharing: false,
      mlh_communications: false,
      info_accurate: false,
      understands_admission: false,
    },
  })

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      setIsSubmitting(true)
      
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      
      if (userError || !user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("applications")
        .insert([
          {
            user_id: user.id,
            ...values,
            status: "Under Review",
          },
        ])

      if (error) throw error

      router.push("/dashboard/success")
    } catch (error) {
      console.error("Error submitting application:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">RocketHacks Application</h1>
          <p className="text-muted-foreground">
            Please fill out all required fields in the application form below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
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
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your current address" {...field} />
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
                    <FormLabel>Country of Citizenship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
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

            {/* Education Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Education</h2>

              <FormField
                control={form.control}
                name="is_student"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are you currently a student?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("is_student") && (
                <>
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your school name" {...field} />
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
                        <FormLabel>Level of Study</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level of study" />
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
                        <FormLabel>Expected Graduation Year</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select graduation year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {graduationYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
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
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Major/Field of Study</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your major" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Experience</h2>

              <FormField
                control={form.control}
                name="technical_skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                    <div className="grid grid-cols-2 gap-4 mt-2">
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
                              <FormLabel className="font-normal">
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
                    <FormDescription>
                      Select all that you're comfortable with
                    </FormDescription>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {PROGRAMMING_LANGUAGES.map((language) => (
                        <FormField
                          key={language}
                          control={form.control}
                          name="programming_languages"
                          render={({ field }) => (
                            <FormItem
                              key={language}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(language)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, language])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== language
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {language}
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
                name="hackathon_experience"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Have you participated in hackathons before?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
                          placeholder="Describe your previous hackathon experiences..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Team & Goals Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Team & Goals</h2>

              <FormField
                control={form.control}
                name="has_team"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you already have a team?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch("has_team") && (
                <>
                  <FormField
                    control={form.control}
                    name="needs_teammates"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Would you like help finding teammates?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "true")}
                            defaultValue={field.value ? "true" : "false"}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("needs_teammates") && (
                    <FormField
                      control={form.control}
                      name="desired_teammate_skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What skills are you looking for in teammates?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the skills or roles you're looking for..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you hope to achieve at RocketHacks?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your goals for the hackathon..."
                        className="resize-none"
                        {...field}
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
                    <FormLabel>How did you hear about RocketHacks?</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Social Media, Friend, School, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Support Needs Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Support Needs</h2>

              <FormField
                control={form.control}
                name="needs_sponsorship"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you need travel or accommodation sponsorship?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessibility_needs"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have any accessibility needs?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
                          placeholder="Tell us how we can support your participation..."
                          className="resize-none"
                          {...field}
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
                  <FormItem className="space-y-3">
                    <FormLabel>Do you have any dietary restrictions?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
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
                          placeholder="Tell us about your dietary requirements..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Emergency Contact</h2>

              <FormField
                control={form.control}
                name="emergency_contact_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
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
                      <Input placeholder="+1 (555) 000-0000" {...field} />
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
                      <Input placeholder="e.g., Parent, Sibling, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Demographics Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Demographics</h2>

              <FormField
                control={form.control}
                name="tshirt_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>T-Shirt Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race/Ethnicity (Optional)</FormLabel>
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {ETHNICITIES.map((ethnicity) => (
                        <FormField
                          key={ethnicity}
                          control={form.control}
                          name="ethnicity"
                          render={({ field }) => (
                            <FormItem
                              key={ethnicity}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(ethnicity)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, ethnicity])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== ethnicity
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {ethnicity}
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
                name="underrepresented"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      Do you identify as part of an underrepresented group in tech?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Agreements Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Agreements</h2>

              <FormField
                control={form.control}
                name="mlh_code_of_conduct"
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
                        I agree to abide by the MLH Code of Conduct
                      </FormLabel>
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to share my application data with MLH
                      </FormLabel>
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
                      <FormLabel>
                        I would like to receive updates from MLH
                      </FormLabel>
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I certify that the information provided is accurate
                      </FormLabel>
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand that this registration does not guarantee admission
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
} 