"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Home, LayoutDashboard, FileText, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: React.ElementType
  requiresAuth?: boolean
  hideWhenAuth?: boolean
}

const navItems: NavItem[] = [
  {
    name: "Home",
    url: "/",
    icon: Home,
    requiresAuth: false,
  },
  {
    name: "Apply",
    url: "/auth/signup",
    icon: FileText,
    requiresAuth: false,
    hideWhenAuth: true,
  },
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    requiresAuth: true,
  },
  {
    name: "Application",
    url: "/dashboard/application",
    icon: FileText,
    requiresAuth: true,
  },
  {
    name: "Profile",
    url: "/profile",
    icon: User,
    requiresAuth: true,
  },
  {
    name: "Sign Out",
    url: "#",
    icon: LogOut,
    requiresAuth: true,
  },
]

export function TubelightNavbar() {
  const [activeTab, setActiveTab] = useState("Home")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleClick = async (item: NavItem) => {
    if (item.name === "Sign Out") {
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
      return
    }

    if (item.requiresAuth && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    setActiveTab(item.name)
  }

  const filteredItems = navItems.filter(item => 
    (!item.requiresAuth || (item.requiresAuth && isAuthenticated)) && 
    (!item.hideWhenAuth || !isAuthenticated)
  )

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6">
      <div className="flex items-center gap-3 bg-black/50 border border-[#15397F] backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => handleClick(item)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-white/80 hover:text-[#FFDA00]",
                isActive && "text-[#FFDA00]",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-[#15397F]/20 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FFDA00] rounded-t-full">
                    <div className="absolute w-12 h-6 bg-[#FFDA00]/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-[#FFDA00]/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-[#FFDA00]/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
