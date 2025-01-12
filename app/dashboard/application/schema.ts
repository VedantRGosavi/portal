import * as z from "zod"

const currentYear = new Date().getFullYear()
const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

export const applicationFormSchema = z.object({
  // Basic Info
  phone_number: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  citizenship: z.string().min(1, "Country of citizenship is required"),
  
  // Education
  is_student: z.boolean(),
  school: z.string().optional(),
  study_level: z.string().optional(),
  graduation_year: z.number().optional(),
  major: z.string().optional(),
  
  // Experience
  attended_mlh: z.boolean(),
  technical_skills: z.array(z.string()),
  programming_languages: z.array(z.string()),
  hackathon_experience: z.boolean(),
  hackathon_experience_desc: z.string().optional(),
  
  // Team & Goals
  has_team: z.boolean(),
  needs_teammates: z.boolean(),
  desired_teammate_skills: z.string().optional(),
  goals: z.string().min(1, "Please tell us what you hope to achieve"),
  heard_from: z.string().min(1, "Please tell us how you heard about the event"),
  
  // Support Needs
  needs_sponsorship: z.boolean(),
  accessibility_needs: z.boolean(),
  accessibility_desc: z.string().optional(),
  dietary_restrictions: z.boolean(),
  dietary_desc: z.string().optional(),
  
  // Emergency Contact
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_phone: z.string().min(10, "Valid phone number is required"),
  emergency_contact_relation: z.string().min(1, "Relationship is required"),
  
  // Demographics
  tshirt_size: z.string().min(1, "Please select a t-shirt size"),
  ethnicity: z.array(z.string()),
  underrepresented: z.boolean(),
  
  // Agreements
  mlh_code_of_conduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Code of Conduct",
  }),
  mlh_data_sharing: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH data sharing agreement",
  }),
  mlh_communications: z.boolean(),
  info_accurate: z.boolean().refine((val) => val === true, {
    message: "You must certify that the information provided is accurate",
  }),
  understands_admission: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge that registration does not guarantee admission",
  }),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema> 