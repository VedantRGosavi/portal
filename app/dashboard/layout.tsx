import { TubelightNavbar } from "@/components/ui/tubelight-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TubelightNavbar />
      {children}
    </>
  )
} 