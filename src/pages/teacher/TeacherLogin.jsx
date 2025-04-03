"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { TeacherAuthContext } from "../../context/TeacherAuthContext"
import { fetchData } from "../../utils/api"
import { ArrowLeft } from "react-feather"

function TeacherLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useContext(TeacherAuthContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const data = await fetchData("/teacher-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const { message, teacher_details, token } = data
      // console.log("Data:", data)

      // Save user details and token to global context (Teacher context)
      setUser({ token, teacher_details })

      // Save token to localStorage for persistent session
      localStorage.setItem("token-teach", token)
      localStorage.setItem("teacher_info", JSON.stringify(teacher_details))

      // console.log("Login successful:", token, teacher_details)

      // Redirect to the teacher dashboard
      navigate("/teacher/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      alert(error.message || "Failed to connect to the server.")
    }
  }

  return (
    <div className="min-h-screen quiz-gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <button onClick={() => navigate("/")} className="back-button">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="quiz-card quiz-glow">
          <h2 className="text-3xl text-center font-bold mb-6" style={{ color: "var(--color-purple-400)" }}>
            Teacher Login
          </h2>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="quiz-label">Email</label>
              <input
                type="email"
                className="quiz-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="quiz-label">Password</label>
              <input
                type="password"
                className="quiz-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-md transition-all transform hover:scale-105"
              style={{
                backgroundColor: "var(--color-purple-600)",
                color: "white",
              }}
            >
              Login
            </button>
          </form>

          {/* Redirect to Signup */}
          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <a
              href="/teacher/signup"
              style={{ color: "var(--color-purple-400)" }}
              className="font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TeacherLogin

