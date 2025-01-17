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
                <span className="text-sm font-medium text-red-500">February 15, 2025</span>
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
              <Button 
                variant="outline" 
                className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]"
                onClick={() => window.open('https://rockethacks.devpost.com', '_blank')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                Check Devpost
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]"
                onClick={() => router.push('/schedule')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                View Schedule
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-foreground hover:text-[#FFDA00] border-[#005CB9]"
                onClick={() => window.open('https://rockethacks.org', '_blank')}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Event Sponsors
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
              <p className="font-medium text-[#FFDA00]">Keynote Speaker Reveal Coming Soon!</p>
              <p className="text-sm text-muted-foreground">Stay tuned for the announcement of our inspiring keynote speaker.</p>
            </li>
            <li>
              <p className="font-medium text-[#FFDA00]">New Workshop Added: Intro to Github using Perplexity AI</p>
              <p className="text-sm text-muted-foreground">Learn the basics of Github and troubleshooting Github issues using Perplexity AI in our new workshop.</p>
            </li>
            <li>
              <p className="font-medium text-[#FFDA00]">AWS and Perplexity AI Sponsor RocketHacks</p>
              <p className="text-sm text-muted-foreground">AWS and Perplexity AI are sponsoring RocketHacks this year! We are so excited to have them onboard.</p>
            </li>
            <li>
              <p className="font-medium"><span className="text-red-500">Reminder:</span> <span className="text-[#FFDA00]">Registration Closes Soon</span></p>
              <p className="text-sm text-muted-foreground">Don't forget to register your team before the deadline!</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 