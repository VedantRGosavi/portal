// app/page.tsx

'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { type ReactElement } from 'react'
import { FlickeringGrid } from "@/components/ui/flickering-grid"

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Flickering Grid */}
      <div className="fixed inset-0 w-full h-full z-0">
        <FlickeringGrid
          color="#15397F"
          maxOpacity={0.15}
          squareSize={4}
          gridGap={6}
          flickerChance={0.2}
          goldFlickerChance={0.015}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 p-4 max-w-7xl mx-auto">
        <div className="space-y-6">
          <img
            src="/images/logo.svg"
            alt="RocketHacks"
            className="h-64 w-auto mx-auto"
          />
          <h1 className="text-6xl font-bold tracking-tight text-white">
            RocketHacks Application Portal
          </h1>
          <p className="text-2xl text-[#FFDA00]">
            March 15-16, 2025
          </p>
        </div>
      </div>
    </main>
  )
}
