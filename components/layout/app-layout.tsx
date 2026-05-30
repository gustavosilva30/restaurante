"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface AppLayoutProps {
  children: React.ReactNode
  title: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Touch Swipe Gesture Refs for Mobile Menu Swiping
  const touchStartRef = React.useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchEnd - touchStartRef.current

    // Swipe Right from Left Edge (clientX < 50px) to Open Sidebar
    if (diff > 70 && touchStartRef.current < 50) {
      setMobileMenuOpen(true)
    }
    
    // Swipe Left to Close Sidebar
    if (diff < -70 && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  // Trigger loading skeleton simulation whenever page title (route) changes
  React.useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 550) // Premium response duration
    return () => clearTimeout(timer)
  }, [title])

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-background text-foreground transition-colors duration-300 antialiased font-sans"
    >
      
      {/* Sidebar - Desktop Layout */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay Blur */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-md md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[280px] transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0 animate-in slide-in-from-left" : "-translate-x-full"
        )}
      >
        <Sidebar
          collapsed={false}
          onToggle={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      {/* Main Content Area */}
      <main
        className={cn(
          "flex min-h-screen flex-col w-full transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "md:pl-[72px]" : "md:pl-[280px]"
        )}
      >
        {/* Desktop Wrapper Layout */}
        <div className="hidden md:block w-full">
          <Header
            title={title}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
          
          <div className="p-4 md:p-6 overflow-hidden w-full">
            <AnimatePresence mode="wait">
              {isLoading ? (
                // 1. FUTURISTIC PREMIUM SKELETON LOADER STATE
                <motion.div
                  key="skeleton-loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Top Stats Cards Skeletons */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 select-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-5 border border-slate-200/50 dark:border-muted/30 rounded-3xl bg-slate-50/50 dark:bg-card/50 shadow-sm space-y-3.5">
                        <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-muted" />
                        <Skeleton className="h-7 w-24 bg-slate-200 dark:bg-muted" />
                      </div>
                    ))}
                  </div>

                  {/* Main Work Area Skeletons */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-5 border border-slate-200/50 dark:border-muted/30 rounded-3xl bg-slate-50/50 dark:bg-card/50 space-y-4 shadow-sm">
                      <div className="flex justify-between">
                        <Skeleton className="h-4.5 w-40 bg-slate-200 dark:bg-muted" />
                        <Skeleton className="h-6 w-20 bg-slate-200 dark:bg-muted" />
                      </div>
                      <Skeleton className="h-44 w-full bg-slate-200 dark:bg-muted rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-3.5 w-[85%] bg-slate-200 dark:bg-muted" />
                        <Skeleton className="h-3.5 w-[60%] bg-slate-200 dark:bg-muted" />
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200/50 dark:border-muted/30 rounded-3xl bg-slate-50/50 dark:bg-card/50 space-y-4 shadow-sm">
                      <Skeleton className="h-4.5 w-24 bg-slate-200 dark:bg-muted" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((s) => (
                          <div key={s} className="flex items-center gap-2.5">
                            <Skeleton className="h-10 w-10 bg-slate-200 dark:bg-muted rounded-xl shrink-0" />
                            <div className="flex-1 space-y-1.5">
                              <Skeleton className="h-3.5 w-full bg-slate-200 dark:bg-muted" />
                              <Skeleton className="h-2.5 w-2/3 bg-slate-200 dark:bg-muted" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // 2. LUXURY PAGE ENTRY SPRING TRANSITION
                <motion.div
                  key="page-content"
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Wrapper Layout */}
        <div className="md:hidden">
          <Header
            title={title}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
          <div className="p-4 overflow-hidden">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="mobile-skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-4 border border-slate-200/50 dark:border-muted/30 rounded-2xl bg-slate-50/50 dark:bg-card/50 space-y-2">
                        <Skeleton className="h-2.5 w-12 bg-slate-200 dark:bg-muted" />
                        <Skeleton className="h-6 w-16 bg-slate-200 dark:bg-muted" />
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border border-slate-200/50 dark:border-muted/30 rounded-2xl bg-slate-50/50 dark:bg-card/50 space-y-3">
                    <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-muted" />
                    <Skeleton className="h-32 w-full bg-slate-200 dark:bg-muted rounded-xl" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
