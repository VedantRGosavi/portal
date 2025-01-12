"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 right-0 p-4">
      <Button 
        onClick={handleSignOut}
        variant="outline" 
        className="border-[#15397F] text-[#FFDA00] hover:bg-[#15397F] hover:text-[#FFDA00]"
      >
        Sign Out
      </Button>
    </nav>
  )
} 