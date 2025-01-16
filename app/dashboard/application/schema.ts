import { z } from "zod"
// app/dashboard/application/schema.ts
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const applicationFormSchema = z.object({
  // Add these fields at the top
  user_id: z.string().uuid().optional(),
  status: z.enum(["Draft", "Under Review", "Accepted", "Rejected"]).optional(),
  updated_at: z.string().optional(),
  
  // Basic Info - Making required fields non-nullable
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone_number: z.string().refine((val) => phoneRegex.test(val), "Valid phone number is required"),
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  address: z.string().nullable(),
  citizenship: z.string().min(1, "Country of residence is required"),
  
  // Education - Making required fields non-nullable
  is_student: z.boolean(),
  school: z.string().min(1, "School name is required"),
  study_level: z.string().min(1, "Level of study is required"),
  graduation_year: z.coerce.number().nullable(),
  major: z.string().nullable(),
  school_email: z.string().email().nullable(),
  
  // Experience
  attended_mlh: z.boolean(),
  technical_skills: z.array(z.string()),
  programming_languages: z.array(z.string()),
  hackathon_experience: z.boolean(),
  hackathon_experience_desc: z.string().nullable(),
  
  // Team & Goals
  has_team: z.boolean(),
  needs_teammates: z.boolean(),
  desired_teammate_skills: z.string().nullable(),
  goals: z.string().nullable(),
  heard_from: z.string().nullable(),
  
  // Support Needs
  needs_sponsorship: z.boolean(),
  accessibility_needs: z.boolean(),
  accessibility_desc: z.string().nullable(),
  dietary_restrictions: z.boolean(),
  dietary_desc: z.string().nullable(),
  
  // Emergency Contact
  emergency_contact_name: z.string().nullable(),
  emergency_contact_phone: z.string().nullable().refine((val) => {
    if (!val) return true;
    return phoneRegex.test(val);
  }, "Invalid phone number format"),
  emergency_contact_relation: z.string().nullable(),
  
  // Demographics
  tshirt_size: z.string().nullable(),
  ethnicity: z.array(z.string()),
  underrepresented: z.boolean(),
  
  // Agreements
  mlh_code_of_conduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Code of Conduct"
  }),
  mlh_data_sharing: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH data sharing terms"
  }),
  mlh_communications: z.boolean(),
  info_accurate: z.boolean(),
  understands_admission: z.boolean(),
  
  // Links & Documents
  resume_url: z.string().nullable(),
  linkedin_url: z.string().url().nullish().or(z.literal('')),
  github_url: z.string().url().nullish().or(z.literal('')),
  portfolio_url: z.string().url().nullish().or(z.literal('')),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema> 