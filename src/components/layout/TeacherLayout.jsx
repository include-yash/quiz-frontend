"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, PlusCircle, List, Settings, LogOut, User } from "react-feather"
import { Sidebar, SidebarHeader, SidebarItem, SidebarSection, SidebarProvider } from "../ui/sidebar"

const TeacherLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem("token-teach")
    localStorage.removeItem("teacher_info")
    navigate("/teacher/login")
  }

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-2xl font-bold text-quiz-purple-400">Quizrr</h1>
            </div>
          </SidebarHeader>

          <SidebarSection title="Main">
            <SidebarItem
              icon={Home}
              label="Dashboard"
              active={isActive("/teacher/dashboard")}
              onClick={() => navigate("/teacher/dashboard")}
            />
            <SidebarItem
              icon={PlusCircle}
              label="Create Test"
              active={isActive("/teacher/create-test")}
              onClick={() => navigate("/teacher/create-test")}
            />
            <SidebarItem
              icon={List}
              label="View Tests"
              active={isActive("/teacher/view-tests")}
              onClick={() => navigate("/teacher/view-tests")}
            />
          </SidebarSection>

          <SidebarSection title="Account">
            <SidebarItem
              icon={User}
              label="Profile"
              active={isActive("/teacher/profile")}
              onClick={() => navigate("/teacher/profile")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={isActive("/teacher/settings")}
              onClick={() => navigate("/teacher/settings")}
            />
            <SidebarItem icon={LogOut} label="Logout" onClick={handleLogout} />
          </SidebarSection>
        </Sidebar>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default TeacherLayout

