"use client"

import  Select  from "../../components/ui/select"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Lock, Eye, EyeOff, Save, Moon, Sun } from "react-feather"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import { useToast } from "../../components/ui/toast"

const Settings = () => {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  // Password settings
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [quizCompletionAlerts, setQuizCompletionAlerts] = useState(true)
  const [systemUpdates, setSystemUpdates] = useState(false)

  // Appearance settings
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("english")

  const handlePasswordChange = (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Please fill in all password fields", { type: "error" })
      return
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match", { type: "error" })
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      addToast("Password updated successfully", { type: "success" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1000)
  }

  const handleNotificationSave = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      addToast("Notification preferences saved", { type: "success" })
    }, 1000)
  }

  const handleAppearanceSave = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      addToast("Appearance settings saved", { type: "success" })
    }, 1000)
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-quiz-purple-400">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <a
                    href="#password"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-quiz-purple-600/20 text-quiz-purple-400"
                  >
                    <Lock size={16} className="mr-3" />
                    Password
                  </a>
                  <a
                    href="#notifications"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 hover:bg-quiz-purple-600/10 hover:text-quiz-purple-400"
                  >
                    <Bell size={16} className="mr-3" />
                    Notifications
                  </a>
                  <a
                    href="#appearance"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-400 hover:bg-quiz-purple-600/10 hover:text-quiz-purple-400"
                  >
                    <Moon size={16} className="mr-3" />
                    Appearance
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              id="password"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock size={20} className="mr-2" /> Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">New Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Confirm New Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              id="notifications"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell size={20} className="mr-2" /> Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                        <p className="text-xs text-gray-400">Receive email notifications for important updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className="w-11 h-6 bg-quiz-dark-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quiz-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">Quiz Completion Alerts</h3>
                        <p className="text-xs text-gray-400">Get notified when students complete your quizzes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={quizCompletionAlerts}
                          onChange={() => setQuizCompletionAlerts(!quizCompletionAlerts)}
                        />
                        <div className="w-11 h-6 bg-quiz-dark-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quiz-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white">System Updates</h3>
                        <p className="text-xs text-gray-400">
                          Receive notifications about system updates and maintenance
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={systemUpdates}
                          onChange={() => setSystemUpdates(!systemUpdates)}
                        />
                        <div className="w-11 h-6 bg-quiz-dark-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-quiz-purple-600"></div>
                      </label>
                    </div>

                    <Button onClick={handleNotificationSave} className="flex items-center gap-2" disabled={loading}>
                      <Save size={16} /> Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              id="appearance"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon size={20} className="mr-2" /> Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                            theme === "dark"
                              ? "border-quiz-purple-600 bg-quiz-purple-600/20"
                              : "border-quiz-dark-50 bg-quiz-dark-50"
                          }`}
                        >
                          <Moon size={24} className={theme === "dark" ? "text-quiz-purple-400" : "text-gray-400"} />
                          <span
                            className={`mt-2 text-sm ${theme === "dark" ? "text-quiz-purple-400" : "text-gray-400"}`}
                          >
                            Dark
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                            theme === "light"
                              ? "border-quiz-purple-600 bg-quiz-purple-600/20"
                              : "border-quiz-dark-50 bg-quiz-dark-50"
                          }`}
                        >
                          <Sun size={24} className={theme === "light" ? "text-quiz-purple-400" : "text-gray-400"} />
                          <span
                            className={`mt-2 text-sm ${theme === "light" ? "text-quiz-purple-400" : "text-gray-400"}`}
                          >
                            Light
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTheme("system")}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center border ${
                            theme === "system"
                              ? "border-quiz-purple-600 bg-quiz-purple-600/20"
                              : "border-quiz-dark-50 bg-quiz-dark-50"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={theme === "system" ? "text-quiz-purple-400" : "text-gray-400"}
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                          <span
                            className={`mt-2 text-sm ${theme === "system" ? "text-quiz-purple-400" : "text-gray-400"}`}
                          >
                            System
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Language</label>
                      <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="japanese">Japanese</option>
                      </Select>
                    </div>

                    <Button onClick={handleAppearanceSave} className="flex items-center gap-2" disabled={loading}>
                      <Save size={16} /> Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}

export default Settings

