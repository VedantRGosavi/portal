import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ApplicationFormValues } from "@/app/dashboard/application/schema"
import { FileIcon } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ApplicationReadOnlyViewProps {
  application: ApplicationFormValues;
}

export function ApplicationReadOnlyView({ application }: ApplicationReadOnlyViewProps) {
  const router = useRouter()
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleViewResume = async () => {
    if (!application.resume_url) return

    try {
      setIsLoadingResume(true)
      const filePath = application.resume_url.split('/').pop()
      if (!filePath) {
        throw new Error('Invalid resume URL')
      }

      const { data, error } = await supabase
        .storage
        .from('resumes')
        .createSignedUrl(filePath, 60)

      if (error) {
        throw error
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Error viewing resume:', error)
      toast({
        title: "Error",
        description: "Unable to view resume. Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingResume(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Basic Information Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Basic Information</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Phone Number</h3>
            <p className="text-muted-foreground">{application.phone_number || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Address</h3>
            <p className="text-muted-foreground">{application.address || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Citizenship</h3>
            <p className="text-muted-foreground">{application.citizenship || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Education</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Student Status</h3>
            <p className="text-muted-foreground">{application.is_student ? 'Current Student' : 'Not a Student'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">School</h3>
            <p className="text-muted-foreground">{application.school || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Study Level</h3>
            <p className="text-muted-foreground">{application.study_level || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Graduation Year</h3>
            <p className="text-muted-foreground">{application.graduation_year || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Major</h3>
            <p className="text-muted-foreground">{application.major || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">School Email</h3>
            <p className="text-muted-foreground">{application.school_email || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Experience</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">MLH Participation</h3>
            <p className="text-muted-foreground">{application.attended_mlh ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <h3 className="font-medium text-white">Technical Skills</h3>
            <p className="text-muted-foreground">
              {application.technical_skills.length > 0 
                ? application.technical_skills.join(', ') 
                : 'None provided'}
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <h3 className="font-medium text-white">Programming Languages</h3>
            <p className="text-muted-foreground">
              {application.programming_languages.length > 0 
                ? application.programming_languages.join(', ') 
                : 'None provided'}
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <h3 className="font-medium text-white">Hackathon Experience</h3>
            <p className="text-muted-foreground">{application.hackathon_experience ? 'Yes' : 'No'}</p>
            {application.hackathon_experience_desc && (
              <p className="text-muted-foreground mt-2">{application.hackathon_experience_desc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Team & Goals Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Team & Goals</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Has Team</h3>
            <p className="text-muted-foreground">{application.has_team ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Looking for Teammates</h3>
            <p className="text-muted-foreground">{application.needs_teammates ? 'Yes' : 'No'}</p>
          </div>
          {application.desired_teammate_skills && (
            <div className="space-y-2 sm:col-span-2">
              <h3 className="font-medium text-white">Desired Teammate Skills</h3>
              <p className="text-muted-foreground">{application.desired_teammate_skills}</p>
            </div>
          )}
          <div className="space-y-2 sm:col-span-2">
            <h3 className="font-medium text-white">Goals</h3>
            <p className="text-muted-foreground">{application.goals || 'Not provided'}</p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <h3 className="font-medium text-white">How did you hear about us?</h3>
            <p className="text-muted-foreground">{application.heard_from || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Support Needs Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Support Needs</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Needs Sponsorship</h3>
            <p className="text-muted-foreground">{application.needs_sponsorship ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Accessibility Needs</h3>
            <p className="text-muted-foreground">{application.accessibility_needs ? 'Yes' : 'No'}</p>
            {application.accessibility_desc && (
              <p className="text-muted-foreground mt-2">{application.accessibility_desc}</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Dietary Restrictions</h3>
            <p className="text-muted-foreground">{application.dietary_restrictions ? 'Yes' : 'No'}</p>
            {application.dietary_desc && (
              <p className="text-muted-foreground mt-2">{application.dietary_desc}</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Emergency Contact</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Name</h3>
            <p className="text-muted-foreground">{application.emergency_contact_name || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Phone</h3>
            <p className="text-muted-foreground">{application.emergency_contact_phone || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Relationship</h3>
            <p className="text-muted-foreground">{application.emergency_contact_relation || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Additional Information</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-white">T-Shirt Size</h3>
            <p className="text-muted-foreground">{application.tshirt_size || 'Not provided'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Ethnicity</h3>
            <p className="text-muted-foreground">
              {application.ethnicity.length > 0 
                ? application.ethnicity.join(', ') 
                : 'Not provided'}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Underrepresented Group</h3>
            <p className="text-muted-foreground">{application.underrepresented ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Links & Documents Section */}
      <div className="bg-black/30 rounded-lg p-6 border border-[#005CB9]/20">
        <h2 className="text-xl font-semibold text-[#FFDA00] mb-6">Links & Documents</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-white">Resume</h3>
            {application.resume_url ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#005CB9] text-white hover:bg-[#005CB9] hover:text-[#FFDA00] inline-flex items-center gap-2"
                  onClick={handleViewResume}
                  disabled={isLoadingResume}
                >
                  <FileIcon className="h-4 w-4" />
                  {isLoadingResume ? "Loading..." : "View Resume"}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Not provided</p>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">LinkedIn Profile</h3>
            <p className="text-muted-foreground">
              {application.linkedin_url ? (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFDA00] hover:underline"
                >
                  {application.linkedin_url}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">GitHub Profile</h3>
            <p className="text-muted-foreground">
              {application.github_url ? (
                <a
                  href={application.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFDA00] hover:underline"
                >
                  {application.github_url}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Portfolio Website</h3>
            <p className="text-muted-foreground">
              {application.portfolio_url ? (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFDA00] hover:underline"
                >
                  {application.portfolio_url}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-end pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="bg-[#005CB9]/10 hover:bg-[#005CB9]/20 text-white border-[#005CB9]"
          >
            Back to Dashboard
          </Button>
        </div>
        <p className="text-center text-muted-foreground text-sm">
          If you need to make any changes to the application, please reach us at rockethacks [at] utoledo.edu
        </p>
      </div>
    </div>
  )
} 