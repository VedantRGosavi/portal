// app/dashboard/layout.tsx
  
import { TubelightNavbar } from "@/components/ui/tubelight-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 