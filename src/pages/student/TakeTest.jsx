"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { fetchData } from "../../utils/api"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, Clock, Flag, HelpCircle, Play, X } from "lucide-react"

const TakeTest = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useContext(AuthContext)
  const timerRef = useRef(null)

  const answersRef = useRef([])
  const scoreRef = useRef(0)
  const attemptedQuestionsRef = useRef(0)


  const initialTimer = location.state?.selectedTest?.timer * 60 || 120 // Timer in seconds
  const questions = location.state?.parsedQuestions || [] // Questions array
  const quiz_id = location.state?.selectedTest?.id
  const [timeLeft, setTimeLeft] = useState(initialTimer)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [attemptedQuestions, setAttemptedQuestions] = useState(0)
  const [isTestStarted, setIsTestStarted] = useState(false)
  const [isTestFinished, setIsTestFinished] = useState(false)
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false)
  const [answers, setAnswers] = useState(Array(questions.length).fill(""))
  const [questionProgress, setQuestionProgress] = useState(Array(questions.length).fill(false))
  const [showSidebar, setShowSidebar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  useEffect(() => {
    const checkIfQuizAlreadyAttempted = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found.")
          alert("You must be logged in to start the test.")
          navigate("/student/login", { replace: true })
          return
        }

        try {
          // Fetch attempted quizzes with timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

          const result = await fetchData("/student/get-quiz-id", {
            method: "GET",
            headers: {
              Authorization: token,
            },
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          const attemptedQuizIds = result.quiz_ids || []
          if (attemptedQuizIds.includes(quiz_id)) {
            // If quiz has already been attempted, redirect to the dashboard
            console.warn("Quiz already attempted, redirecting to dashboard")
            navigate("/student/dashboard", { replace: true })
          }
        } catch (error) {
          console.error("Error checking quiz attempt, continuing with test:", error)
          // Continue with the test even if we can't check if it's been attempted
          // This allows the app to work offline or when the API is unavailable
        }
      } catch (error) {
        console.error("Error in quiz initialization:", error)
        alert(`An error occurred while initializing the quiz: ${error.message}`)
      }
    }

    // Only check if there are questions and the timer is valid
    if (questions.length && initialTimer > 0) {
      checkIfQuizAlreadyAttempted()
    } else {
      console.error("Invalid test data. Redirecting to dashboard.")
      navigate("/student/dashboard")
    }

    // Cleanup when the component is unmounted
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [questions.length, initialTimer, navigate, quiz_id])

  // Trigger fullscreen after user interacts with the page
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.mozRequestFullScreen) {
      // Firefox
      document.documentElement.mozRequestFullScreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
      // IE/Edge
      document.documentElement.msRequestFullscreen()
    }
  }
  const countAttemptedQuestions = () => {
    return answers.filter(answer => answer && answer.trim() !== "").length;
  };

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    attemptedQuestionsRef.current = attemptedQuestions
  }, [attemptedQuestions])

  // Handle starting the test
  const handleStartTest = () => {
    setIsTestStarted(true);
    enterFullscreen();
  
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Clear timer immediately and synchronously
          clearInterval(timerRef.current);
          timerRef.current = null;
          
          // Use current ref values directly
          const submissionData = {
            answers: answersRef.current,
            score: scoreRef.current,
            attempted: answersRef.current.filter(a => a?.trim()).length
          };
          
          // Submit only if not already submitting
          if (!isSubmitting) {
            handleSubmit(submissionData);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  

  // Handle answer change
  const handleAnswerChange = (option) => {
    setSelectedAnswer(option)

    // Update answers array
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = option
    setAnswers(newAnswers)

    // Update question progress
    const newProgress = [...questionProgress]
    newProgress[currentQuestionIndex] = true
    setQuestionProgress(newProgress)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1] || "")
    }
  }

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    let updatedScore = score
    let updatedAttemptedQuestions = attemptedQuestions

    // Check if this is the first time answering this question
    if (!questionProgress[currentQuestionIndex] && selectedAnswer) {
      // Check the answer and update the score
      if (currentQuestion.type === "mcq") {
        if (selectedAnswer === currentQuestion.options[currentQuestion.correctOption]) {
          updatedScore += 1
        }
      } else if (currentQuestion.type === "true-false") {
        if ((selectedAnswer === "true" ? true : false) === currentQuestion.correctAnswer) {
          updatedScore += 1
        }
      }

      // Update attempted questions count
      updatedAttemptedQuestions += 1

      // Set state after handling the question
      setScore(updatedScore)
      setAttemptedQuestions(updatedAttemptedQuestions)
    }

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers[currentQuestionIndex + 1] || "")
    }
  }

  const handleSubmit = async (submissionData = null) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    // Clear the timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/student/login", { replace: true });
        return;
      }
  
      // Use submission data if available, otherwise use current refs
      const answersToUse = submissionData?.answers || answersRef.current;
      let finalScore = 0;
      let finalAttempted = 0;
  
      // Validate and process each answer
      questions.forEach((question, index) => {
        const studentAnswer = answersToUse[index];
        
        // Only count as attempted if answer exists and is valid
        if (studentAnswer && studentAnswer.trim() !== "") {
          finalAttempted += 1;
  
          // Score calculation
          if (question.type === "mcq") {
            if (studentAnswer === question.options[question.correctOption]) {
              finalScore += 1;
            }
          } else if (question.type === "true-false") {
            if (studentAnswer.toLowerCase() === String(question.correctAnswer).toLowerCase()) {
              finalScore += 1;
            }
          }
        }
      });
  
      console.log("Submission data:", {
        quiz_id,
        score: finalScore,
        attempted: finalAttempted,
        total: questions.length,
        answers: answersToUse
      });
  
      // API call with enhanced error handling
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
        const response = await fetch(`http://127.0.0.1:10000/student/savescore`, {
          method: "POST",
          headers: {
            "Authorization": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quiz_id,
            score: finalScore,
            attempted: finalAttempted, // Send attempted count to server
            total: questions.length
          }),
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("Submission successful:", result);
  
      } catch (apiError) {
        console.error("API submission error:", apiError);
        // Store submission locally if API fails
        localStorage.setItem(`quiz_${quiz_id}_backup`, JSON.stringify({
          score: finalScore,
          attempted: finalAttempted,
          timestamp: new Date().toISOString()
        }));
      }
  
      // Navigate to results page
      navigate("/student/success", {
        state: {
          totalQuestions: questions.length,
          attemptedQuestions: finalAttempted,
          score: finalScore,
          answers: answersToUse // Include answers in navigation state
        },
        replace: true,
      });
  
    } catch (error) {
      console.error("SUBMISSION ERROR:", {
        error: error.message,
        stack: error.stack
      });
      
      alert(`Test submission failed: ${error.message}\n\nYour progress has been saved locally.`);
      
      // Fallback navigation
      navigate("/student/dashboard", {
        state: {
          submissionError: true,
          message: "Your test results were saved locally and will be synced later."
        },
        replace: true
      });
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsSubmitting(false);
    }
  };

  // Current question to display
  const currentQuestion = questions[currentQuestionIndex]

  // Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!isTestStarted) return

      const token = localStorage.getItem("token")

      try {
        // Add timeout to prevent hanging on API call
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        await fetchData("/student/add-tab-switch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            quiz_id: quiz_id,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
      } catch (error) {
        console.error("Error reporting tab switch, continuing with warning:", error)
        // Continue with the warning even if API call fails
      }

      if (document.hidden && isTestStarted) {
        setTabSwitchWarning(true)
        setTimeout(() => setTabSwitchWarning(false), 3000)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [quiz_id, isTestStarted])

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get time color based on remaining time
  const getTimeColor = () => {
    if (timeLeft < 30) return "text-red-500"
    if (timeLeft < 60) return "text-yellow-500"
    return "text-white"
  }

  // Calculate progress percentage
  const progressPercentage = (attemptedQuestions / questions.length) * 100

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Timer Section */}
      {isTestStarted && (
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Clock className={`h-5 w-5 mr-2 ${getTimeColor()}`} />
              <span className={`text-xl font-mono font-bold ${getTimeColor()}`}>{formatTime(timeLeft)}</span>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-3">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-1.5 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switch Warning */}
      <AnimatePresence>
        {tabSwitchWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span>Tab switching detected! This will be reported to your teacher.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Navigation Sidebar */}
      <AnimatePresence>
        {showSidebar && isTestStarted && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20"
              onClick={() => setShowSidebar(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-gray-900 border-l border-gray-800 z-30 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-medium">Question Navigator</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index)
                        setSelectedAnswer(answers[index] || "")
                        setShowSidebar(false)
                      }}
                      className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? "bg-purple-700 text-white"
                          : questionProgress[index]
                            ? "bg-green-700/30 text-green-400 border border-green-700/50"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-md flex items-center justify-center transition-colors"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Submit Test
                  </button>

                  <div className="mt-4 text-xs text-gray-500">
                    <p>
                      You've answered {attemptedQuestions} out of {questions.length} questions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm Submit Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
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
              <div className="border-b border-gray-800 p-4">
                <h3 className="text-lg font-semibold">Submit Test?</h3>
              </div>

              <div className="p-5">
                <div className="mb-5">
                  <p className="text-gray-300 mb-3">
                    Are you sure you want to submit your test? You've answered {countAttemptedQuestions()} out of{" "}
                    {questions.length} questions.
                  </p>

                  {attemptedQuestions < questions.length && (
                    <div className="bg-yellow-900/30 border border-yellow-800/50 rounded-md p-3 text-yellow-300 text-sm flex items-start">
                      <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <span>
                        You have {questions.length - countAttemptedQuestions()} unanswered questions. Once submitted, you
                        cannot return to this test.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!isSubmitting) handleSubmit()
                      setShowConfirmSubmit(false)
                    }}
                    className="px-4 py-2 text-sm bg-purple-800 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4">
        {/* Start Test Button */}
        {!isTestStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="text-center"
          >
            <div className="bg-gray-900 border border-gray-800 p-10 rounded-xl max-w-md">
              <div className="w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Play className="h-8 w-8 text-purple-400" />
              </div>

              <h2 className="text-2xl font-bold mb-4">Ready to Begin?</h2>
              <p className="text-gray-400 mb-8">
                Click the button below to start your test. The timer will begin immediately and you'll enter full-screen
                mode.
              </p>

              <button
                onClick={handleStartTest}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 rounded-md transition-colors flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                <span>Start Test</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Show the test content only after the test has started */}
        {isTestStarted && (
          <div className="w-full max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
              >
                {/* Question Header */}
                <div className="bg-gray-900 p-5 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
                    <div className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-gray-400">
                      {currentQuestion.type === "mcq" ? "Multiple Choice" : "True/False"}
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-5">
                  <p className="text-lg mb-6">{currentQuestion.question}</p>

                  {/* Answer Options */}
                  <div className="space-y-3 mb-8">
                    {currentQuestion.type === "mcq" && (
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerChange(option)}
                            className={`w-full p-4 rounded-md text-left transition-all ${
                              selectedAnswer === option
                                ? "bg-purple-900/50 border border-purple-700 text-white"
                                : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                                  selectedAnswer === option ? "bg-purple-700 border-purple-600" : "border-gray-600"
                                }`}
                              >
                                {selectedAnswer === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === "true-false" && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAnswerChange("true")}
                          className={`p-4 rounded-md text-center transition-all ${
                            selectedAnswer === "true"
                              ? "bg-purple-900/50 border border-purple-700 text-white"
                              : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          True
                        </button>
                        <button
                          onClick={() => handleAnswerChange("false")}
                          className={`p-4 rounded-md text-center transition-all ${
                            selectedAnswer === "false"
                              ? "bg-purple-900/50 border border-purple-700 text-white"
                              : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          False
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        currentQuestionIndex === 0
                          ? "bg-gray-800/30 text-gray-600 cursor-not-allowed"
                          : "bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </button>

                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className={`px-4 py-2 rounded-md flex items-center ${
                          !selectedAnswer
                            ? "bg-purple-900/30 text-purple-400/50 cursor-not-allowed"
                            : "bg-purple-700 text-white hover:bg-purple-600 transition-colors"
                        }`}
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowConfirmSubmit(true)}
                        disabled={!selectedAnswer}
                        className={`px-4 py-2 rounded-md flex items-center ${
                          !selectedAnswer
                            ? "bg-green-900/30 text-green-400/50 cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-green-600 transition-colors"
                        }`}
                      >
                        Submit Test
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default TakeTest

