"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Schedule() {
  const router = useRouter()

  return (
    <div className="container mx-auto min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background border-[#005CB9]">
        <CardContent className="p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-[#FFDA00]">Event Schedule</h1>
          <div className="space-y-4">
            <p className="text-xl text-white">Stay tuned!</p>
            <p className="text-muted-foreground">
              We're preparing an exciting schedule for RocketHacks 2025. 
              Check back soon for updates on workshops, activities, and more!
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="mt-6 border-[#005CB9] text-white hover:bg-[#005CB9] hover:text-[#FFDA00]"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 