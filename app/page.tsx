"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { type ReactElement } from 'react'

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <div className="space-y-4">
          <img
            src="/images/logo.svg"
            alt="RocketHacks"
            className="h-16 w-auto mx-auto"
          />
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-text text-transparent">
            RocketHacks
          </h1>
          <p className="text-xl text-muted-foreground">
            Join us for an incredible hackathon experience where innovation meets opportunity
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
          <Link href="/auth/login">
            <Button variant="default" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full">
              Register
            </Button>
          </Link>
        </div>

        <div className="space-y-4 mt-12">
          <h2 className="text-2xl font-semibold">Why Join RocketHacks?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Learn & Grow</h3>
              <p className="text-muted-foreground">
                Enhance your skills through workshops and mentorship
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Build Together</h3>
              <p className="text-muted-foreground">
                Connect with fellow hackers and form lasting relationships
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Win Prizes</h3>
              <p className="text-muted-foreground">
                Compete for exciting prizes and recognition
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            className="bg-[#15397F] text-[#FFDA00] hover:bg-[#FFDA00] hover:text-[#15397F]"
            onClick={() => router.push('/auth/signup')}
          >
            Sign up for RocketHacks
          </Button>
        </div>
      </div>
    </main>
  )
}
