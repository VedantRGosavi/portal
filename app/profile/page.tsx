'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfileSettings() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    dob: '',
    school: '',
    role: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profile')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setFormData({
            display_name: data.display_name || '',
            email: data.email || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            school: data.school || '',
            role: data.role || ''
          })
        }
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
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profile')
        .update({
          display_name: formData.display_name,
          email: formData.email,
          dob: formData.dob,
          school: formData.school,
          role: formData.role,
          is_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="overflow-hidden bg-black border border-zinc-800">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <p className="text-balance text-gray-400">
              Update your personal information
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="display_name" className="text-white">
                Display Name
              </Label>
              <Input
                type="text"
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob" className="text-white">
                Date of Birth
              </Label>
              <Input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="school" className="text-white">
                School
              </Label>
              <Input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-white">
                Role
              </Label>
              <Input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
                disabled
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-[#15397F] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#15397F]"
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