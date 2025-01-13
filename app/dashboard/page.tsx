"use client"
// app/dashboard/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { ApplicationStatusCard } from "@/components/ui/application-status-card"

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [displayName, setDisplayName] = useState('Hacker')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('profile')
            .select('display_name')
            .eq('id', user.id)
            .single()
          
          if (data?.display_name) {
            setDisplayName(data.display_name)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-bold text-[#FFDA00]">Welcome back, {displayName}!</h2>
        <p className="text-muted-foreground mt-2">Track your application progress and updates here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ApplicationStatusCard />

        <Card className="bg-background border-[#005CB9]">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Important Dates</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Application Deadline</span>
                <span className="text-sm font-medium text-[#FFDA00]">February 15, 2025</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team Formation</span>
                <span className="text-sm font-medium text-[#FFDA00]">March 1, 2025</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hackathon Starts</span>
                <span className="text-sm font-medium text-[#FFDA00]">March 15, 2025</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-background border-[#005CB9]">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                View Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background border-[#005CB9]">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Announcements</h3>
          <ul className="space-y-4">
            <li>
              <p className="font-medium text-[#FFDA00]">New Workshop Added: Intro to AI</p>
              <p className="text-sm text-muted-foreground">Learn the basics of AI and machine learning in our new workshop.</p>
            </li>
            <li>
              <p className="font-medium text-[#FFDA00]">Mentor Office Hours Updated</p>
              <p className="text-sm text-muted-foreground">Check the schedule for new mentor availability times.</p>
            </li>
            <li>
              <p className="font-medium text-[#FFDA00]">Reminder: Team Registration Closes Soon</p>
              <p className="text-sm text-muted-foreground">Don't forget to register your team before the deadline!</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 