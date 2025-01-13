"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function ApplicationStatusCard() {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState<string>('Draft')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: application } = await supabase
          .from('applications')
          .select('status')
          .eq('user_id', user.id)
          .single()

        if (application) {
          setStatus(application.status)
        }
      } catch (error) {
        console.error('Error fetching application status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplicationStatus()
  }, [])

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
        <h3 className="text-lg font-medium text-foreground mb-4">Application Status</h3>
        <div className="flex items-center justify-between mb-6">
          <span className={`text-lg font-medium ${getStatusColor(status)}`}>
            Decision: {status}
          </span>
        </div>
        <Button 
          className="w-full bg-[#005CB9] text-foreground hover:bg-[#005CB9]/90"
          onClick={() => router.push('/dashboard/application')}
        >
          {status === 'Draft' ? 'Start Application' : 'View Application'}
        </Button>
      </CardContent>
    </Card>
  )
} 