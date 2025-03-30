"use client"
import { useNavigate } from "react-router-dom"
import { User, BookOpen } from "react-feather"

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen quiz-gradient-bg text-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-extrabold" style={{ color: "var(--color-purple-400)" }}>
          Quizrr
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center w-full max-w-lg mx-auto text-center px-4">
        <h2 className="text-3xl font-semibold text-white mb-4">Welcome to Quizrr</h2>
        <p className="text-xl font-medium text-gray-300 mb-8">Select your role to get started</p>

        {/* Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 w-full">
          <button
            className="quiz-card quiz-card-hover p-8 rounded-xl"
            style={{ borderColor: "rgba(76, 29, 149, 0.2)" }}
            onClick={() => navigate("/student/login")}
          >
            <div className="flex flex-col items-center">
              <User size={64} style={{ color: "var(--color-purple-400)" }} className="mb-4" />
              <h2 className="text-xl font-semibold">Student Login</h2>
            </div>
          </button>
          <button
            className="quiz-card quiz-card-hover p-8 rounded-xl"
            style={{ borderColor: "rgba(76, 29, 149, 0.2)" }}
            onClick={() => navigate("/teacher/login")}
          >
            <div className="flex flex-col items-center">
              <BookOpen size={64} style={{ color: "var(--color-purple-400)" }} className="mb-4" />
              <h2 className="text-xl font-semibold">Teacher Login</h2>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Quizrr. All rights reserved.</p>
      </div>
    </div>
  )
}

export default HomePage

