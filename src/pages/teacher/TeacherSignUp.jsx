"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchData } from "../../utils/api"
import { ArrowLeft } from "react-feather"

function TeacherSignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    const payload = { email, password }
    console.log("Payload:", payload)

    try {
      const data = await fetchData("/signup/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Sign-up successful", data)
      alert("Sign-up successful! Please log in.")
      navigate("/teacher/login")
    } catch (error) {
      console.error("Error during sign-up:", error.message)
      alert("Sign-up failed: " + error.message)
    }
  }

  return (
    <section className="min-h-screen quiz-gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <button onClick={() => navigate("/")} className="back-button">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="quiz-card quiz-glow">
          <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "var(--color-purple-400)" }}>
            Teacher Sign Up
          </h2>
          <form onSubmit={handleSignUp}>
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="quiz-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="quiz-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="quiz-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="quiz-input"
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
              Sign Up
            </button>

            {/* Redirect to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/teacher/login")}
                  style={{ color: "var(--color-purple-400)" }}
                  className="font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default TeacherSignUp

