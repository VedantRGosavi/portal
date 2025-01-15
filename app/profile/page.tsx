// app/profile/page.tsx

'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
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
  display_name: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  age: z.string().refine((val) => !val || (parseInt(val) >= 13 && parseInt(val) <= 120), {
    message: "Age must be between 13 and 120",
  }),
  school: z.string().min(1, "School is required"),
})

export default function ProfileSettings() {
  const router = useRouter()
  const supabase = createClient()
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
    defaultValues: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('profile')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (error) throw error
          
          if (data) {
            return {
              display_name: data.display_name || '',
              email: data.email || '',
              age: data.age?.toString() || '',
              school: data.school || ''
            }
          }
        }
        return {
          display_name: '',
          email: '',
          age: '',
          school: ''
        }
      } catch (error) {
        console.error('Error fetching initial profile data:', error)
        return {
          display_name: '',
          email: '',
          age: '',
          school: ''
        }
      }
    }
  })

  const handleSaveChanges = async (values: z.infer<typeof profileSchema>) => {
    if (loading) return;
    
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "No user found. Please try logging in again.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from('profile')
        .update({
          display_name: values.display_name,
          email: values.email,
          age: values.age ? parseInt(values.age) : null,
          school: values.school,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Refresh the form with the latest values
      form.reset(values)
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
                Please complete your profile information before accessing other features. This helps us provide you with a better experience.
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
                    <Label htmlFor="display_name" className="text-foreground">
                      Display Name
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="age" className="text-foreground">
                      Age
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="13"
                        max="120"
                        className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <VirtualizedSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      searchValue={schoolSearch}
                      onSearchChange={setSchoolSearch}
                      options={filteredSchools}
                      placeholder="Select your school"
                    />
                    <FormMessage className="text-[#FFDA00]" />
                  </FormItem>
                )}
              />

              <div className="mt-6 flex justify-end">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#005CB9] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#005CB9]"
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