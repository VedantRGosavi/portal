// app/profile/page.tsx


'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { schools } from '@/lib/constants/schools'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounce } from "@/hooks/use-debounce"
import { VirtualizedSelect } from "@/components/ui/virtualized-select"

const profileSchema = z.object({
  display_name: z.string().min(1, "Display name is required").max(50, "Display name must be less than 50 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  age: z.string().min(1, "Age is required").refine((val) => parseInt(val) >= 13 && parseInt(val) <= 120, {
    message: "Age must be between 13 and 120",
  }),
  school: z.string().min(1, "School is required"),
})

// Create Supabase client outside component for consistent identity
const supabase = createClient()

export default function ProfileSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [schoolSearch, setSchoolSearch] = useState('')
  const debouncedSchoolSearch = useDebounce(schoolSearch, 300)

  const filteredSchools = useMemo(() => {
    if (!debouncedSchoolSearch) return [...schools]
    return schools.filter(school => 
      school.toLowerCase().includes(debouncedSchoolSearch.toLowerCase())
    )
  }, [debouncedSchoolSearch])

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: '',
      email: '',
      age: '',
      school: ''
    }
  })

  // Load initial profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching profile:', error)
          throw error
        }

        // Set form values
        form.reset({
          display_name: data?.display_name || '',
          email: data?.email || user.email || '',
          age: data?.age?.toString() || '',
          school: data?.school || ''
        })

        // Only update search if there's no current search value
        if (data?.school && !schoolSearch) {
          setSchoolSearch('')
        }
      } catch (error) {
        console.error('Error fetching initial profile data:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    loadProfile()
  }, [])

  // Add cleanup for async operations
  useEffect(() => {
    const abortController = new AbortController()
    return () => {
      abortController.abort()
    }
  }, [])

  const handleSaveChanges = async (values: z.infer<typeof profileSchema>) => {
    if (loading) return;
    
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })
        router.push('/auth/login')
        return
      }

      const { error } = await supabase
        .from('profile')
        .update({
          display_name: values.display_name.trim(),
          email: values.email.trim(),
          age: values.age ? parseInt(values.age) : null,
          school: values.school,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      })

      // Navigate to dashboard after successful update
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update profile. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl mx-auto bg-black border-[#005CB9]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold text-[#FFDA00]">Profile Settings</h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
            <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-[#005CB9] max-w-lg">
              <p className="text-sm text-[#FFDA00]">
                Please complete your profile information before accessing other features. 
                Fields marked with * are required.
              </p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveChanges)} className="space-y-4">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                        placeholder="Enter your display name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                        placeholder="your.email@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="13"
                        max="120"
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                        placeholder="Enter your age"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School *</FormLabel>
                    <VirtualizedSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      searchValue={schoolSearch}
                      onSearchChange={setSchoolSearch}
                      options={filteredSchools}
                      placeholder="Select your school"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6 flex justify-between">
                <Button 
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="border-[#005CB9] text-[#FFDA00] hover:bg-[#005CB9]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={loading || !form.formState.isDirty}
                  className="bg-[#005CB9] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#005CB9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 