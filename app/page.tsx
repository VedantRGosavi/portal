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
    <main className="relative min-h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center overflow-hidden pt-8 pb-4">
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
      <div className="relative z-10 text-center space-y-2 sm:space-y-4 p-4 w-full max-w-[90vw] sm:max-w-7xl mx-auto">
        <div className="space-y-2 sm:space-y-4">
          <img
            src="/images/logo.svg"
            alt="RocketHacks"
            className="h-24 sm:h-40 md:h-48 w-auto mx-auto"
          />
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white px-2 break-words">
            RocketHacks Application Portal
          </h1>
          <p className="text-xl sm:text-2xl text-[#FFDA00]">
            March 15-16, 2025
          </p>
        </div>
      </div>
    </main>
  )
}
