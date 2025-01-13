"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { Home, LayoutDashboard, FileText, User, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/hooks/use-admin"

interface NavItem {
  name: string
  url: string
  icon: React.ElementType
  requiresAuth?: boolean
  hideWhenAuth?: boolean
}

export function TubelightNavbar() {
  const { isAdmin } = useAdmin()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

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
    ...(isAdmin ? [{
      name: "Admin",
      url: "/admin",
      icon: Settings,
      requiresAuth: true,
    }] : []),
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

  // Get the active tab based on the current pathname
  const getActiveTab = (path: string) => {
    // Sort navItems by URL length (descending) to match most specific routes first
    const sortedItems = [...navItems].sort((a, b) => b.url.length - a.url.length)
    
    const matchingItem = sortedItems.find(item => {
      if (item.url === "#") return false // Skip Sign Out
      if (item.url === "/" && path === "/") return true // Exact match for home
      if (item.url === "/dashboard" && path.startsWith("/dashboard")) return true // Match dashboard and its subroutes
      if (item.url === "/admin" && path.startsWith("/admin")) return true // Match admin and its subroutes
      return path === item.url // Exact match for other routes
    })
    
    return matchingItem?.name || "Home"
  }

  const [activeTab, setActiveTab] = useState(getActiveTab(pathname))

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab(pathname))
  }, [pathname])

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

    // Immediately update the active tab for better visual feedback
    if (item.url !== "#") {
      setActiveTab(item.name)
    }
  }

  const filteredItems = navItems.filter(item => 
    (!item.requiresAuth || (item.requiresAuth && isAuthenticated)) && 
    (!item.hideWhenAuth || !isAuthenticated)
  )

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] pt-6">
      <div className="flex items-center gap-3 bg-black/50 border border-[#15397F] backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {filteredItems.map((item) => {
          const isActive = activeTab === item.name
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => {
                if (item.name === "Sign Out") {
                  e.preventDefault();
                }
                handleClick(item);
              }}
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
