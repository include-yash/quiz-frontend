"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { fetchData } from "../../utils/api"
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Trophy,
  User,
  X,
} from "lucide-react"

const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-800/50 rounded ${className}`}></div>

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null)
  const [upcomingTests, setUpcomingTests] = useState([])
  const [attemptedTests, setAttemptedTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const navigate = useNavigate()

  useEffect(() => {
    const studentDetails = JSON.parse(localStorage.getItem("studentDetails"))
    setStudentProfile(studentDetails)

    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("Token not found")
          return
        }

        const [quizzesResponse, attemptedResponse] = await Promise.all([
          fetchData("/student", {
            method: "GET",
            headers: { Authorization: token },
          }),
          fetchData("/student/get-quiz-id", {
            method: "GET",
            headers: { Authorization: token },
          }),
        ])

        const attemptedQuizIds = attemptedResponse.quiz_ids || []
        const allQuizzes = quizzesResponse.quizzes || []
        const attempted = allQuizzes.filter((quiz) => attemptedQuizIds.includes(quiz.id))
        const upcoming = allQuizzes.filter((quiz) => !attemptedQuizIds.includes(quiz.id))

        setAttemptedTests(attempted)
        setUpcomingTests(upcoming)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        // Simulate loading for better UX
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    fetchQuizzes()
  }, [])

  const handleAttemptTest = (test) => {
    setSelectedTest(test)
    setShowPopup(true)
  }

  const handleContinue = async () => {
    try {
      const data = await fetchData(
        `/student/get-quiz-details?quiz_id=${selectedTest.id}&quiz_name=${encodeURIComponent(selectedTest.quiz_name)}`,
        {
          method: "GET",
          headers: { Authorization: localStorage.getItem("token") },
        },
      )

      if (data.quiz && data.quiz.questions) {
        navigate("/student/take-test", {
          state: {
            parsedQuestions: data.quiz.questions,
            selectedTest,
          },
        })
      } else {
        console.error("No quiz data found")
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error)
    }
  }

  const handleViewLeaderboard = (test) => {
    navigate(`/student/leaderboard/${test.id}`, { replace: true })
  }

  const handleLogout = () => {
    const keysToRemove = [
      "token",
      "studentDetails",
      "teacherDetails",
      "student_info",
      "teacher_info",
      "token-teach",
      "__clerk_environment",
      "clerk_telemetry_throttler"
    ];
  
    keysToRemove.forEach(key => localStorage.removeItem(key));
  
    navigate("/student/login"); // or replace with "/login" if it's shared
  };

  // Loading skeletons
  if (loading) {
    return (
      <div className="flex h-screen bg-black">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex md:w-64 flex-col bg-gray-900 border-r border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <Skeleton className="h-8 w-32 mb-2" />
          </div>
          <div className="p-4">
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-6" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="mb-8">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            </div>

            <div className="mb-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/80 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed md:relative z-30 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-0" : "-left-64 md:left-0"
        }`}
        initial={false}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-purple-700 flex items-center justify-center mr-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Quizzr
            </h1>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <button className="w-full flex items-center px-3 py-2 text-sm rounded-md bg-purple-900/50 text-purple-100 font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3 text-purple-400" />
            Dashboard
          </button>

          <button className="w-full flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Calendar className="w-5 h-5 mr-3" />
            Schedule
          </button>

          <button className="w-full flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Trophy className="w-5 h-5 mr-3" />
            Achievements
          </button>

          <button className="w-full flex items-center px-3 py-2 text-sm rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </div>

        {/* User profile */}
        {studentProfile && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{studentProfile.name}</p>
                <p className="text-xs text-gray-500 truncate">{studentProfile.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center px-3 py-2 text-xs rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button className="md:hidden mr-3 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          {studentProfile && (
            <div className="flex items-center">
              <div className="hidden md:block mr-3 text-right">
                <p className="text-sm font-medium">{studentProfile.name}</p>
                <p className="text-xs text-gray-500">{studentProfile.department}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-purple-900/50 border border-purple-700/50 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          )}
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          {/* Stats cards */}
          {studentProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-900/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="text-sm font-medium">{studentProfile.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-900/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium">{studentProfile.department}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-purple-900/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Section</p>
                    <p className="text-sm font-medium">
                      {studentProfile.section} - {studentProfile.batch_year}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-800">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`pb-3 text-sm font-medium relative ${
                  activeTab === "upcoming" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Upcoming Tests
                {activeTab === "upcoming" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("attempted")}
                className={`pb-3 text-sm font-medium relative ${
                  activeTab === "attempted" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Attempted Tests
                {activeTab === "attempted" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </button>
            </div>
          </div>

          {/* Tests grid */}
          <AnimatePresence mode="wait">
            {activeTab === "upcoming" && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {upcomingTests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingTests.map((test) => (
                      <motion.div
                        key={test.id}
                        whileHover={{ y: -4 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-700/50 hover:shadow-[0_0_15px_rgba(109,40,217,0.15)] transition-all duration-300"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold line-clamp-1">{test.quiz_name}</h3>
                            <div className="px-2 py-1 bg-purple-900/30 rounded-md text-xs font-medium text-purple-400">
                              New
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-400">
                              <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Section: {test.section}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Batch: {test.batch_year}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Duration: {test.timer} minutes</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAttemptTest(test)}
                            className="w-full bg-purple-800 hover:bg-purple-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
                          >
                            <span>Start Test</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                    <Calendar className="w-12 h-12 mx-auto text-gray-700 mb-3" />
                    <h3 className="text-lg font-medium text-gray-400 mb-1">No Upcoming Tests</h3>
                    <p className="text-sm text-gray-600">Check back later for new tests</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "attempted" && (
              <motion.div
                key="attempted"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {attemptedTests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attemptedTests.map((test) => (
                      <motion.div
                        key={test.id}
                        whileHover={{ y: -4 }}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-green-700/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold line-clamp-1">{test.quiz_name}</h3>
                            <div className="px-2 py-1 bg-green-900/30 rounded-md text-xs font-medium text-green-400">
                              Completed
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-400">
                              <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Section: {test.section}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Batch: {test.batch_year}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewLeaderboard(test)}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                            <span>View Leaderboard</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                    <Trophy className="w-12 h-12 mx-auto text-gray-700 mb-3" />
                    <h3 className="text-lg font-medium text-gray-400 mb-1">No Attempted Tests</h3>
                    <p className="text-sm text-gray-600">Complete a test to see your results here</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Test Instructions Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <div className="border-b border-gray-800 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Instructions</h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <h4 className="text-xl font-semibold mb-2">{selectedTest?.quiz_name}</h4>
                  <div className="flex items-center text-sm text-gray-400 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Duration: {selectedTest?.timer} minutes</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 mb-3">Please read the following instructions carefully:</p>
                  <ul className="space-y-3">
                    <li className="flex">
                      <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-xs">1</span>
                      </div>
                      <span className="text-gray-400">Attempt all questions within the given time.</span>
                    </li>
                    <li className="flex">
                      <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-xs">2</span>
                      </div>
                      <span className="text-gray-400">
                        The test will be submitted automatically when the time expires.
                      </span>
                    </li>
                    <li className="flex">
                      <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-xs">3</span>
                      </div>
                      <span className="text-gray-400">
                        Switching tabs or exiting full-screen mode will be recorded.
                      </span>
                    </li>
                    <li className="flex">
                      <div className="w-5 h-5 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-xs">4</span>
                      </div>
                      <span className="text-gray-400">No external help is allowed during the test.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContinue}
                    className="px-4 py-2 text-sm bg-purple-800 hover:bg-purple-700 text-white rounded-md transition-colors"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudentDashboard

