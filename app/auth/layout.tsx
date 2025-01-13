// app/auth/layout.tsx
'use client'

import { FlickeringGrid } from "@/components/ui/flickering-grid"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
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
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
} 