"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope, Menu, Home, Users, Calendar, Settings, LogOut, Brain, Activity, BarChart3, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Visits", href: "/visits", icon: Activity },
  { name: "AI Assistant", href: "/ai-assistant", icon: Brain },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-medledger-light/20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-medledger-teal/20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Stethoscope className="h-7 w-7 text-medledger-teal" />
            <span className="text-lg font-bold text-medledger-navy">MedLedger NG</span>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-medledger-navy hover:bg-medledger-teal/10"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <Collapsible open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <CollapsibleContent className="border-t border-medledger-teal/20 bg-white">
            <nav className="px-4 py-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-medledger-teal text-white"
                        : "text-medledger-navy hover:bg-medledger-light/50 hover:text-medledger-teal",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout()
                    closeMobileMenu()
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </header>

      {/* Main Content */}
      <main className="pb-6">
        <div className="px-4 py-6 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Optional: Bottom Navigation for Mobile (Alternative approach) */}
      {/* Uncomment this section if you prefer bottom navigation instead */}
      {/*
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-medledger-teal/20 md:hidden z-40">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors",
                pathname === item.href
                  ? "bg-medledger-teal/10 text-medledger-teal"
                  : "text-gray-600 hover:text-medledger-teal"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      */}
    </div>
  )
}
