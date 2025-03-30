"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { Menu, X } from "react-feather"

const SidebarContext = createContext({
  expanded: true,
  setExpanded: () => {},
  isMobile: false,
  mobileOpen: false,
  setMobileOpen: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setExpanded(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        setExpanded,
        isMobile,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({ children, className }) => {
  const { expanded, setExpanded, isMobile, mobileOpen, setMobileOpen } = useSidebar()

  // Handle mobile sidebar
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-quiz-purple-600 text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={cn(
                  "fixed inset-y-0 left-0 z-50 w-64 bg-quiz-dark-100 border-r border-quiz-purple-900/20 p-4 shadow-lg",
                  className,
                )}
              >
                <div className="flex justify-end mb-4 lg:hidden">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-md hover:bg-quiz-purple-600/20 text-quiz-purple-400"
                    aria-label="Close sidebar"
                  >
                    <X size={20} />
                  </button>
                </div>
                {children}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-r border-quiz-purple-900/20 bg-quiz-dark-100 transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-20",
        className,
      )}
    >
      <div className="p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hidden lg:flex w-full justify-center p-2 mb-4 rounded-md hover:bg-quiz-purple-600/20 text-quiz-purple-400"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <Menu size={20} /> : <Menu size={20} />}
        </button>
        {children}
      </div>
    </aside>
  )
}

export const SidebarHeader = ({ children, className }) => {
  const { expanded } = useSidebar()

  return <div className={cn("mb-6", className)}>{children}</div>
}

export const SidebarItem = ({ icon: Icon, label, active, onClick, className }) => {
  const { expanded } = useSidebar()

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full p-2 mb-1 rounded-md transition-all duration-200",
        active
          ? "bg-quiz-purple-600 text-white shadow-md shadow-quiz-purple-900/20"
          : "text-gray-400 hover:bg-quiz-purple-600/20 hover:text-white",
        className,
      )}
    >
      {Icon && <Icon size={20} className={cn("flex-shrink-0", expanded ? "mr-3" : "mx-auto")} />}
      {expanded && <span className="truncate">{label}</span>}
    </button>
  )
}

export const SidebarSection = ({ title, children, className }) => {
  const { expanded } = useSidebar()

  return (
    <div className={cn("mb-6", className)}>
      {expanded && title && (
        <h3 className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

