// app/layout.tsx

import "./globals.css"
import { ThemeProvider } from "next-themes"
import { TubelightNavbar } from "@/components/ui/tubelight-navbar"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "RocketHacks",
  description: "Join us for an incredible hackathon experience where innovation meets opportunity",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-franklinGothic"> 
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <TubelightNavbar />
            <main className="flex-1 pt-24">
              <div className="py-4 md:py-6 px-4 md:px-6 space-y-6">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
