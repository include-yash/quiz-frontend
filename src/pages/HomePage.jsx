"use client"

import { useNavigate } from "react-router-dom"
import { User, BookOpen } from "react-feather"

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <img src="/images/bmsce-logo.jpg" alt="BMSCE Logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">B.M.S College of Engineering</h1>
            <p className="text-xs sm:text-sm text-gray-400">Department of Information Science and Engineering</p>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Quizrr</h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Welcome to Quizrr</h2>
        <p className="text-base sm:text-lg text-gray-400 mb-10">Select your role to continue</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
          <button
            onClick={() => navigate("/student/login")}
            className="bg-neutral-900 hover:bg-purple-900 transition-all p-6 rounded-2xl border border-purple-700 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <User size={48} className="mb-3 text-purple-400" />
              <span className="text-lg font-semibold">Student Login</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/teacher/login")}
            className="bg-neutral-900 hover:bg-purple-900 transition-all p-6 rounded-2xl border border-purple-700 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <BookOpen size={48} className="mb-3 text-purple-400" />
              <span className="text-lg font-semibold">Teacher Login</span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 p-4 border-t border-gray-800">
        <p>&copy; 2025 Quizrr. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage