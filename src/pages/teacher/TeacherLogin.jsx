"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { TeacherAuthContext } from "../../context/TeacherAuthContext"
import { fetchData } from "../../utils/api"
import { ArrowLeft } from "react-feather"
import { useToast } from "../../components/ui/toast"
import { GoogleLogin } from '@react-oauth/google';

function TeacherLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useContext(TeacherAuthContext)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleGoogleLoginTeacher = async (credentialResponse) => {
    const token = credentialResponse.credential;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
  
      const data = await res.json();
  
      if (data?.new_user) {
        // Redirect to new teacher registration form
        navigate('/teacher/signup');
      } else {
        // Save token and teacher details
        setUser({
          token: data.token,
          teacher_details: data.teacher_details,
        });
  
        localStorage.setItem('token', data.token);
        localStorage.setItem('teacherDetails', JSON.stringify(data.teacher_details));
  
        addToast('Google Login successful! Redirecting to dashboard...', { type: 'success' });
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error('Google Login Error (Teacher):', error);
      addToast('Google Login failed. Try again later.', { type: 'error' });
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const data = await fetchData("/teacher-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (data.error) {
        addToast(data.error, { type: "error" })
        return
      }

      const { teacher_details, token } = data
      setUser({ token, teacher_details })
      localStorage.setItem("token-teach", token)
      localStorage.setItem("teacher_info", JSON.stringify(teacher_details))
      navigate("/teacher/dashboard")
    } catch (error) {
      console.error("Login error:", error)

      let userMsg = "Something went wrong. Please try again."
      const msg = error.message || ""

      if (msg.includes("status: 400")) {
        userMsg = "Bad request – please check your credentials."
      } else if (msg.includes("status: 401")) {
        userMsg = "Invalid email or password."
      } else if (msg.includes("status: 500")) {
        userMsg = "Our servers are having trouble right now. Please try again later."
      } else if (msg) {
        userMsg = msg
      }

      addToast(userMsg, { type: "error" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-purple-400 hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-white tracking-tight">
          Teacher Login
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 transition-colors duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginTeacher}
            onError={() => addToast('Google Login failed', { type: 'error' })}
          />
        </div>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/teacher/signup"
            className="text-purple-500 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default TeacherLogin
