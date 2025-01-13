// app/profile/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function ProfileSettings() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    dob: '',
    school: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
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
            setFormData({
              display_name: data.display_name || '',
              email: data.email || '',
              dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
              school: data.school || ''
            })
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try refreshing the page.",
          variant: "destructive",
        })
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveChanges = async () => {
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
          display_name: formData.display_name,
          email: formData.email,
          dob: formData.dob,
          school: formData.school,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Start navigation immediately
      router.prefetch('/dashboard')
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Reduce timeout to minimum and use Promise.all for parallel execution
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 100)), // Minimal delay for toast visibility
        router.push('/dashboard')
      ])
      
      router.refresh()
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
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="display_name" className="text-foreground">
                Display Name
              </Label>
              <Input
                type="text"
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob" className="text-foreground">
                Date of Birth
              </Label>
              <Input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="school" className="text-foreground">
                School
              </Label>
              <Input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="bg-zinc-900 border-[#005CB9] text-foreground focus:ring-[#FFDA00] focus:border-[#FFDA00]"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-[#005CB9] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#005CB9]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 