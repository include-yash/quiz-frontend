"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, ChevronRight, Clock, Home, Target, Trophy } from "lucide-react"

const SuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract data from location state
  const { totalQuestions, attemptedQuestions, score } = location.state || {}

  // Calculate percentage
  const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0

  // Determine performance message and color
  const getPerformanceData = () => {
    if (percentage >= 90) return { message: "Excellent work!", color: "text-green-400" }
    if (percentage >= 70) return { message: "Great job!", color: "text-blue-400" }
    if (percentage >= 50) return { message: "Good effort!", color: "text-yellow-400" }
    return { message: "Keep practicing!", color: "text-purple-400" }
  }

  const performanceData = getPerformanceData()

  // Confetti effect on component mount
  useEffect(() => {
    if (percentage >= 70) {
      const createConfetti = () => {
        const confetti = document.createElement("div")
        confetti.className = "confetti"

        // Random properties
        const size = Math.random() * 10 + 5
        const left = Math.random() * 100
        const background = ["#8B5CF6", "#6D28D9", "#4C1D95", "#EC4899", "#BE185D", "#10B981", "#059669"][
          Math.floor(Math.random() * 7)
        ]

        // Apply styles
        Object.assign(confetti.style, {
          position: "fixed",
          top: "-20px",
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          background,
          borderRadius: "2px",
          zIndex: "1000",
          transform: `rotate(${Math.random() * 360}deg)`,
          pointerEvents: "none",
        })

        document.body.appendChild(confetti)

        // Animate falling
        const animation = confetti.animate(
          [
            { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)`, opacity: 1 },
            {
              transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: Math.random() * 3000 + 2000,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        )

        animation.onfinish = () => confetti.remove()
      }

      // Create multiple confetti pieces
      const interval = setInterval(createConfetti, 100)
      setTimeout(() => clearInterval(interval), 3000)

      // Initial burst
      for (let i = 0; i < 50; i++) {
        setTimeout(createConfetti, Math.random() * 500)
      }

      return () => clearInterval(interval)
    }
  }, [percentage])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {/* Header with success icon */}
          <div className="bg-gray-900 p-6 border-b border-gray-800 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Test Completed</h2>
              <p className={`${performanceData.color}`}>{performanceData.message}</p>
            </div>
          </div>

          {/* Score display */}
          <div className="p-6 flex justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1F2937" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={percentage >= 70 ? "#10B981" : percentage >= 50 ? "#FBBF24" : "#8B5CF6"}
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className="text-sm text-gray-400">Score</span>
              </div>
            </div>
          </div>

          {/* Test details */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-xs text-gray-400">Score</span>
                </div>
                <p className="text-xl font-semibold">
                  {score || 0} / {totalQuestions || 0}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Target className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-xs text-gray-400">Accuracy</span>
                </div>
                <p className="text-xl font-semibold">
                  {attemptedQuestions ? Math.round((score / attemptedQuestions) * 100) : 0}%
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs text-gray-400">Attempted</span>
                </div>
                <p className="text-xl font-semibold">
                  {attemptedQuestions || 0} / {totalQuestions || 0}
                </p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Clock className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-xs text-gray-400">Time</span>
                </div>
                <p className="text-xl font-semibold">2:00</p>
              </div>
            </div>

            {/* Dashboard button */}
            <button
              onClick={() => navigate("/student/dashboard", { replace: true })}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Dashboard
            </button>

            {/* View leaderboard link */}
            <button
              onClick={() => navigate("/student/leaderboard/1", { replace: true })}
              className="w-full mt-3 bg-transparent border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              View Leaderboard
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SuccessPage

