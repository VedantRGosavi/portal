import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { TubelightNavbar } from "@/components/ui/tubelight-navbar"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TubelightNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
