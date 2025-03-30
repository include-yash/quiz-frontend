"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { TeacherAuthContext } from "../../context/TeacherAuthContext"
import { User, PlusCircle, Eye, BarChart2, Clock } from "react-feather"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card"
import Button from "../../components/ui/button"
import { DashboardSkeleton } from "../../components/ui/loading-skeleton"

const TeacherDashboard = () => {
  const { user } = useContext(TeacherAuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTests: 0,
    activeTests: 0,
    totalStudents: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading delay and fetch stats
    const timer = setTimeout(() => {
      // In a real app, you would fetch this data from your API
      setStats({
        totalTests: 12,
        activeTests: 3,
        totalStudents: 87,
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateTest = () => {
    navigate("/teacher/create-test")
  }

  const handleViewTest = () => {
    navigate("/teacher/view-tests")
  }

  if (loading) {
    return (
      <TeacherLayout>
        <DashboardSkeleton />
      </TeacherLayout>
    )
  }

  if (!user || !user.teacher_details) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-red-400">No teacher data available. Please log in again.</div>
          <Button onClick={() => navigate("/teacher/login")} className="mt-4">
            Return to Login
          </Button>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-quiz-purple-400">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.teacher_details.name || "Teacher"}</p>
          </div>
          <Button onClick={handleCreateTest} className="bg-quiz-purple-600 hover:bg-quiz-purple-700">
            <PlusCircle size={18} className="mr-2" /> Create New Test
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-quiz-purple-900/20 bg-card hover:bg-card/80 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-quiz-purple-400 flex items-center text-lg">
                  <BarChart2 size={20} className="mr-2" /> Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalTests}</p>
                <p className="text-muted-foreground text-sm mt-1">Tests created</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-quiz-purple-900/20 bg-card hover:bg-card/80 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-quiz-purple-400 flex items-center text-lg">
                  <Clock size={20} className="mr-2" /> Active Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.activeTests}</p>
                <p className="text-muted-foreground text-sm mt-1">Currently active</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-quiz-purple-900/20 bg-card hover:bg-card/80 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-quiz-purple-400 flex items-center text-lg">
                  <User size={20} className="mr-2" /> Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
                <p className="text-muted-foreground text-sm mt-1">Across all tests</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profile Card */}
        

        {/* Quick Actions */}
         {/* Quick Actions - Redesigned */}
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={handleCreateTest}
                  className="w-full p-4 rounded-lg border border-quiz-purple-200 bg-quiz-purple-50 dark:bg-quiz-purple-900/30 hover:bg-quiz-purple-100 dark:hover:bg-quiz-purple-900/50 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-3 rounded-full bg-quiz-purple-100 dark:bg-quiz-purple-800 text-quiz-purple-600 dark:text-quiz-purple-300 group-hover:bg-quiz-purple-200 dark:group-hover:bg-quiz-purple-700 transition-colors">
                    <PlusCircle size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Create Test</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Design a new assessment</p>
                  </div>
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={handleViewTest}
                  className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 group"
                >
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Eye size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">View Tests</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage existing assessments</p>
                  </div>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </TeacherLayout>
  )
}

export default TeacherDashboard

