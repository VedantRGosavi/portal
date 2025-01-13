import { z } from "zod"
// app/dashboard/application/schema.ts
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const applicationFormSchema = z.object({
  // Add these fields at the top
  user_id: z.string().uuid().optional(),
  status: z.enum(["Draft", "Under Review", "Accepted", "Rejected"]).optional(),
  updated_at: z.string().optional(),
  
  // Basic Info
  phone_number: z.string().nullable().refine((val) => {
    if (!val) return true;
    return phoneRegex.test(val);
  }, "Invalid phone number format"),
  address: z.string().nullable(),
  citizenship: z.string().nullable(),
  
  // Education
  is_student: z.boolean(),
  school: z.string().nullable(),
  study_level: z.string().nullable(),
  graduation_year: z.coerce.number().nullable(),
  major: z.string().nullable(),
  
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
  mlh_code_of_conduct: z.boolean(),
  mlh_data_sharing: z.boolean(),
  mlh_communications: z.boolean(),
  info_accurate: z.boolean(),
  understands_admission: z.boolean(),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema> 