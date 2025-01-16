// app/page.tsx

'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { type ReactElement } from 'react'
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { CenterUnderline, ComesInGoesOutUnderline, GoesOutComesInUnderline } from "@/components/ui/underline-animation"

export default function Home(): ReactElement {
  const router = useRouter()

  return (
    <main className="relative min-h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-between overflow-hidden pt-8">
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

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-2 sm:space-y-4 p-4 w-full max-w-[90vw] sm:max-w-7xl mx-auto -mt-16 sm:-mt-24">
        <div className="space-y-0 sm:space-y-2">
          <a 
            href="https://rockethacks.org" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img
              src="/images/logo.svg"
              alt="RocketHacks"
              className="h-24 sm:h-40 md:h-48 w-auto mx-auto hover:opacity-80 transition-opacity"
            />
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-franklinGothic font-bold tracking-tight text-white px-2 break-words">
            RocketHacks Application Portal
          </h1>
          <p className="text-xl font-franklinGothic sm:text-2xl text-[#FFDA00]">
            March 15-16, 2025
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="fixed bottom-8 inset-x-0 z-10 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2 sm:gap-0">
          <div>
            <h3 className="text-[#FFDA00] text-lg sm:text-xl uppercase">FOLLOW US</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-8 md:gap-16 lg:gap-24 w-full sm:w-auto">
            <div>
              <Link href="https://www.linkedin.com/company/rocket-hacks" target="_blank">
                <ComesInGoesOutUnderline 
                  label="LINKEDIN" 
                  direction="left"
                  className="text-white text-lg sm:text-xl uppercase"
                />
              </Link>
            </div>
            <div>
              <Link href="https://www.instagram.com/rockethacks.ut" target="_blank">
                <ComesInGoesOutUnderline 
                  label="INSTAGRAM" 
                  direction="right"
                  className="text-white text-lg sm:text-xl uppercase" 
                />
              </Link>
            </div>
            <div>
              <Link href="https://x.com/UTRocketHacks" target="_blank">
                <ComesInGoesOutUnderline 
                  label="X (TWITTER)" 
                  direction="left"
                  className="text-white text-lg sm:text-xl uppercase" 
                />
              </Link>
            </div>
            <div>
              <Link href="" target="_blank">
                <CenterUnderline 
                  label="ROCKETHACKS ❤️"
                  className="text-white text-lg sm:text-xl uppercase"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
