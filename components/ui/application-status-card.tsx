"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type ApplicationStatus = {
  status: string
  progress: number
  lastUpdated: string | null
}

export function ApplicationStatusCard() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState<ApplicationStatus>({
    status: 'Not Started',
    progress: 0,
    lastUpdated: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: application } = await supabase
          .from('applications')
          .select('status, updated_at')
          .eq('user_id', user.id)
          .single()

        if (application) {
          const progress = calculateProgress(application.status)
          setStatus({
            status: application.status,
            progress: progress,
            lastUpdated: application.updated_at
          })
        }
      } catch (error) {
        console.error('Error fetching application status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplicationStatus()
  }, [])

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'Draft':
        return 25
      case 'Under Review':
        return 75
      case 'Accepted':
        return 100
      case 'Rejected':
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500'
      case 'Rejected':
        return 'text-red-500'
      case 'Under Review':
        return 'text-[#FFDA00]'
      default:
        return 'text-muted-foreground'
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-background border-[#005CB9]">
        <CardContent className="p-4 sm:p-6">
          <div className="h-[120px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background border-[#005CB9]">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-medium text-foreground mb-2">Application Status</h3>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm ${getStatusColor(status.status)}`}>
            {status.status}
          </span>
          <span className="px-2 py-1 text-xs bg-[#FFDA00] text-background rounded-full">
            {status.progress}% Complete
          </span>
        </div>
        <Progress value={status.progress} className="mb-2 bg-[#005CB9]" />
        <Button 
          className="w-full mt-4 bg-[#005CB9] text-foreground hover:bg-[#005CB9]/90"
          onClick={() => router.push('/dashboard/application')}
        >
          {status.status === 'Not Started' ? 'Start Application' : 'Continue Application'}
        </Button>
      </CardContent>
    </Card>
  )
} 