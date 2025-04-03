"use client"

import { useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Save, X, Check, HelpCircle, AlertTriangle } from "react-feather"
import { TeacherAuthContext } from "../../context/TeacherAuthContext"
import { fetchData } from "../../utils/api"
import TeacherLayout from "../../components/layout/TeacherLayout"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import Button from "../../components/ui/button"
import Input from "../../components/ui/input"
import Select from "../../components/ui/select"
import { useToast } from "../../components/ui/toast"

const CreateQuestions = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const { user } = useContext(TeacherAuthContext)
  const token = localStorage.getItem("token-teach")
  const { testName, testID, department, section } = location.state || {}

  const [showPopup, setShowPopup] = useState(false)
  const [questionType, setQuestionType] = useState("")
  const [questions, setQuestions] = useState([])
  const [questionText, setQuestionText] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctOption, setCorrectOption] = useState(null)
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null)

  const resetForm = () => {
    setQuestionText("")
    setOptions(["", "", "", ""])
    setCorrectOption(null)
    setTrueFalseAnswer(null)
    setQuestionType("")
  }

  const handleSaveQuestion = () => {
    const newQuestion = {
      type: questionType,
      question: questionText,
      ...(questionType === "mcq" && { options, correctOption }),
      ...(questionType === "true-false" && { correctAnswer: trueFalseAnswer }),
    }

    setQuestions([...questions, newQuestion])
    setShowPopup(false)
    resetForm()
    addToast("Question added successfully", { type: "success" })
  }

  const isFormValid = () => {
    if (!questionText) return false

    if (questionType === "mcq") {
      return options.every((opt) => opt.trim() !== "") && correctOption !== null
    }

    if (questionType === "true-false") {
      return trueFalseAnswer !== null
    }

    if (questionType === "type-answer") {
      return questionText.trim() !== ""
    }

    return false
  }

  const quizDetails = JSON.parse(localStorage.getItem("quizDetails")) || {
    department: "ISE",
    batch: "21",
    section: "D",
    testID: "AEO8SGA0SP",
    testName: "hh",
    timer: 10,
  }

  const handleCreateQuiz = async () => {
    if (questions.length === 0) {
      addToast("Please add at least one question", { type: "error" })
      return
    }

    const quizData = {
      quizDetails: quizDetails,
      questions: JSON.stringify(questions),
    }

    try {
      addToast("Creating quiz...", { type: "info" })

      const response = await fetchData("/teacher/createquiz", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      })

      // console.log("Raw Response:", response)

      // If response is already an object, use it directly
      let responseData
      if (response && typeof response === "object" && response.message) {
        responseData = response // Response is already parsed
      } else {
        responseData = await response.json()
      }

      // console.log("Parsed Response:", responseData)

      if (response.ok || responseData.message === "Quiz created successfully") {
        addToast("Quiz created successfully!", { type: "success" })
        navigate("/teacher/dashboard")
      } else {
        // console.log("Error Data:", responseData)
        addToast(`Failed to create quiz: ${responseData.error || "Unknown error"}`, { type: "error" })
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      addToast("An error occurred while creating the quiz", { type: "error" })
    }
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-quiz-purple-400">Create Questions</h1>
          <Button onClick={() => setShowPopup(true)} className="flex items-center gap-2">
            <Plus size={18} /> Add Question
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section: Quiz Details Profile Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>{testName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-quiz-dark-50 rounded-lg p-4 space-y-3 border border-quiz-purple-900/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-quiz-purple-200">Department:</span>
                      <span className="text-gray-400">{quizDetails.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-quiz-purple-200">Batch:</span>
                      <span className="text-gray-400">{quizDetails.batch}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-quiz-purple-200">Section:</span>
                      <span className="text-gray-400">{quizDetails.section}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-quiz-purple-200">Quiz ID:</span>
                      <span className="text-gray-400">{testID}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-quiz-purple-200">Timer:</span>
                      <span className="text-gray-400">{quizDetails.timer} minutes</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleCreateQuiz}
                      className="w-full flex items-center justify-center gap-2"
                      disabled={questions.length === 0}
                    >
                      <Check size={18} /> Create Quiz
                    </Button>
                  </div>

                  {questions.length === 0 && (
                    <div className="mt-4 p-3 bg-quiz-dark-50 border border-quiz-purple-900/10 rounded-md flex items-start gap-2">
                      <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-400">Add at least one question to create the quiz.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Section: Created Questions */}
          <div className="lg:col-span-2">
            {questions.length > 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Questions ({questions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {questions.map((q, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="p-4 border border-quiz-purple-900/20 rounded-md bg-quiz-dark-50 hover:bg-quiz-dark-100 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-quiz-purple-400 font-semibold text-lg">{index + 1}.</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-quiz-purple-300 font-medium text-xs uppercase bg-quiz-dark-100 px-2 py-0.5 rounded">
                                  {q.type}
                                </span>
                              </div>
                              <p className="text-white">{q.question}</p>

                              {q.type === "mcq" && (
                                <div className="mt-2 pl-4 space-y-1">
                                  {q.options.map((option, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <span
                                        className={`w-2 h-2 rounded-full ${i === q.correctOption ? "bg-green-500" : "bg-gray-600"}`}
                                      ></span>
                                      <span className={i === q.correctOption ? "text-green-400" : "text-gray-400"}>
                                        {option}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {q.type === "true-false" && (
                                <div className="mt-2 pl-4">
                                  <span className="text-green-400">
                                    Correct answer: {q.correctAnswer ? "True" : "False"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="bg-quiz-dark-50/50">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <HelpCircle size={48} className="text-quiz-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Questions Yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start by adding questions to your quiz using the "Add Question" button.
                    </p>
                    <Button onClick={() => setShowPopup(true)} className="flex items-center gap-2">
                      <Plus size={18} /> Add Your First Question
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Popup for Adding Question */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-quiz-dark-100 border border-quiz-purple-900/20 rounded-lg shadow-lg shadow-quiz-purple-900/20"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-quiz-purple-400">Add a Question</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowPopup(false)
                        resetForm()
                      }}
                      className="h-8 w-8 rounded-full"
                    >
                      <X size={18} />
                    </Button>
                  </div>

                  {/* Question Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Select Question Type</label>
                    <Select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                      <option value="">Select Type</option>
                      <option value="mcq">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="type-answer">Type Answer</option>
                    </Select>
                  </div>

                  {/* Question Input */}
                  {questionType && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Question</label>
                      <Input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter the question"
                      />
                    </div>
                  )}

                  {/* Multiple Choice Options */}
                  {questionType === "mcq" && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-white">Options</h3>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              setOptions((prev) => prev.map((opt, i) => (i === index ? e.target.value : opt)))
                            }
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="correctOption"
                              checked={correctOption === index}
                              onChange={() => setCorrectOption(index)}
                              className="h-4 w-4 accent-quiz-purple-500"
                            />
                            <label className="text-sm text-gray-400">Correct</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False Answer Selection */}
                  {questionType === "true-false" && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-white">Select Correct Answer</h3>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="trueFalse"
                            value="true"
                            checked={trueFalseAnswer === true}
                            onChange={() => setTrueFalseAnswer(true)}
                            className="h-4 w-4 accent-quiz-purple-500"
                          />
                          <span className="text-sm text-white">True</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="trueFalse"
                            value="false"
                            checked={trueFalseAnswer === false}
                            onChange={() => setTrueFalseAnswer(false)}
                            className="h-4 w-4 accent-quiz-purple-500"
                          />
                          <span className="text-sm text-white">False</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Type Answer Instructions */}
                  {questionType === "type-answer" && (
                    <p className="text-sm text-gray-400">Students will type their answer to this question.</p>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPopup(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    {isFormValid() && (
                      <Button onClick={handleSaveQuestion} className="flex items-center gap-2">
                        <Save size={16} /> Save Question
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TeacherLayout>
  )
}

export default CreateQuestions