"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Plus, RefreshCw, HelpCircle } from "react-feather"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import Select from "../../components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { useToast } from "../../components/ui/toast"

const CreateTest = () => {
  const [testName, setTestName] = useState("")
  const [testID] = useState(Math.random().toString(36).substring(2, 12).toUpperCase())
  const [department, setDepartment] = useState("")
  const [batch, setBatch] = useState("")
  const [section, setSection] = useState("")
  const [timer, setTimer] = useState(0)
  const [activeTab, setActiveTab] = useState("details")

  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleNavigate = () => {
    if (!testName || !department || !batch || !section || timer === 0) {
      addToast("Please fill in all fields before proceeding", { type: "error" })
      return
    }

    const quizDetails = { testName, testID, department, batch, section, timer }
    localStorage.setItem("quizDetails", JSON.stringify(quizDetails))
    navigate("/teacher/create-questions", {
      state: { testName, testID, department, batch, section, timer },
    })
  }

  const addTime = (minutes) => {
    const newTime = Math.min(120, timer + minutes)
    setTimer(newTime)
    addToast(`Added ${minutes} minutes to timer`, { type: "info", duration: 2000 })
  }

  const resetTimer = () => {
    setTimer(0)
    addToast("Timer reset to 0", { type: "info", duration: 2000 })
  }

  const handleBatchChange = (e) => {
    const value = e.target.value
    if (!value || (value >= 21 && value <= 29)) {
      setBatch(value)
    } else {
      addToast("Batch must be between 21 and 29", { type: "warning" })
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-quiz-purple-400">Create New Test</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="details">Test Details</TabsTrigger>
            <TabsTrigger value="timer">Timer Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Test Information</CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Fill in the essential details to create your test
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Quiz Name</label>
                    <Input
                      type="text"
                      placeholder="Enter quiz name"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Department</label>
                    <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option value="">Select Department</option>
                      <option value="is">ISE</option>
                      <option value="CS">CSE</option>
                      <option value="EC">ECE</option>
                      <option value="AI">AIML</option>
                      <option value="BT">BIOTECH</option>
                      <option value="IE">IEM</option>
                      <option value="ME">MECH</option>
                      <option value="CV">CIVIL</option>
                      <option value="IO">CSE-IOT</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Batch (21-29)</label>
                    <Input 
                      type="number" 
                      value={batch} 
                      onChange={handleBatchChange} 
                      min="21" 
                      max="29"
                      className="w-full"
                    />
                    {batch && (batch < 21 || batch > 29) && (
                      <p className="text-red-500 text-xs mt-1">Must be between 21 and 29</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Section</label>
                    <Select value={section} onChange={(e) => setSection(e.target.value)}>
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => navigate("/teacher/dashboard")}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab("timer")}>Continue to Timer</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Clock size={20} className="mr-2" /> Test Duration
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Set how long students will have to complete this test
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Compact Circular Timer */}
                  <div className="relative w-40 h-40 flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold text-white">
                        {timer} min
                      </div>
                    </div>
                    
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - timer/120)}
                        className="text-quiz-purple-500 transition-all duration-300"
                      />
                    </svg>
                  </div>

                  <div className="flex-1 w-full space-y-6">
                    {/* Custom Slider */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white flex justify-between">
                        <span>Duration</span>
                        <span className="text-quiz-purple-400">{timer} minutes</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={timer}
                        onChange={(e) => setTimer(parseInt(e.target.value))}
                        className="w-full h-2 bg-quiz-dark-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-quiz-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0 min</span>
                        <span>120 min</span>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-4 gap-2">
                      {[5, 15, 30, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setTimer(mins)}
                          className={`py-2 rounded-md transition-all text-sm ${
                            timer === mins
                              ? 'bg-quiz-purple-600 text-white shadow-md'
                              : 'bg-quiz-dark-200 text-gray-300 hover:bg-quiz-dark-300'
                          }`}
                        >
                          {mins} min
                        </button>
                      ))}
                    </div>

                    {/* Reset Button */}
                    <Button 
                      onClick={resetTimer} 
                      variant="destructive" 
                      className="w-full sm:w-auto flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Reset Timer
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-quiz-dark-50 rounded-lg border border-quiz-purple-900/20 mt-6">
                  <p className="text-lg text-white font-semibold flex items-center gap-2">
                    <span className="text-quiz-purple-400">Test ID:</span> {testID}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setActiveTab("details")}>
                  Back
                </Button>
                <Button 
                  onClick={handleNavigate} 
                  className="flex items-center gap-2" 
                  disabled={timer === 0}
                >
                  <Plus size={16} /> Create Questions
                </Button>
              </CardFooter>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="bg-quiz-dark-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <HelpCircle size={18} className="mr-2" /> About Test Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    The timer determines how long students will have to complete the test. 
                    Once time expires, tests will be automatically submitted.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                    <li><span className="font-medium">Quick quizzes:</span> 5-15 minutes</li>
                    <li><span className="font-medium">Standard tests:</span> 30 minutes</li>
                    <li><span className="font-medium">Exams:</span> 60+ minutes</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </TeacherLayout>
  )
}

export default CreateTest