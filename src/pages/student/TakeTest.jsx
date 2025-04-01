"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { fetchData } from "../../utils/api"

const TakeTest = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const questions = location.state?.parsedQuestions || []
  const quiz_id = location.state?.selectedTest?.id
  const timerDuration = location.state?.selectedTest?.timer || 60 // Default 60 minutes if not provided

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(""))
  const answersRef = useRef(answers)
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60) // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerRef = useRef(null)

  // Update answersRef whenever answers changes
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // Report tab switch
  const reportTabSwitch = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      await fetchData("/student/add-tab-switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          quiz_id,
        }),
      })
    } catch (error) {
      console.error("Error reporting tab switch:", error)
    }
  }

  // Detect tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting) {
        reportTabSwitch()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isSubmitting, quiz_id])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle timer with Date.now() and setTimeout for more accuracy
  useEffect(() => {
    const endTime = Date.now() + timerDuration * 60 * 1000;
  
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
  
      setTimeLeft(remaining);
  
      if (remaining <= 0) {
        if (!isSubmitting) {
          handleSubmit();
        }
        return;
      }
  
      timerRef.current = setTimeout(updateTimer, 1000);
    };
  
    updateTimer();
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerDuration, isSubmitting]);

  // Count attempted questions
  const countAttemptedQuestions = () => {
    return answersRef.current.filter((answer) => answer !== "").length
  }

  // Calculate score using answersRef
  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (question.type === "mcq") {
        if (Number.parseInt(answersRef.current[index]) === question.correctOption) {
          score++
        }
      } else if (question.type === "true-false") {
        const boolAnswer = answersRef.current[index] === "true"
        if (boolAnswer === question.correctAnswer) {
          score++
        }
      }
    })
    return score
  }

  // Handle answer change
  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  // Handle clear answer
  const handleClearAnswer = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = ""
    setAnswers(newAnswers)
  }

  // Handle navigation between questions
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index)
    }
  }

  // Handle test submission
  const handleSubmit = async () => {
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  
    const finalScore = calculateScore();
    const finalAttempted = countAttemptedQuestions();
  
    try {
      const token = localStorage.getItem("token");
      const controller = new AbortController();
  
      const response = await fetchData(`/student/savescore`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id,
          score: finalScore,
          attempted: finalAttempted,
          total: questions.length,
        }),
        signal: controller.signal,
      });
  
      if (response.ok) {
        navigate("/student/success", {
          state: {
            totalQuestions: questions.length,
            attemptedQuestions: finalAttempted,
            score: finalScore,
            answers: answersRef.current,
            timer: location.state?.selectedTest?.timer,
            quizId: quiz_id,
          },
          replace: true,
        });
      } else {
        alert("Failed to submit test. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("An error occurred while submitting the test.");
      setIsSubmitting(false);
    }
  };

  // Render current question
  const renderQuestion = () => {
    const question = questions[currentQuestion]
    if (!question) return <div className="text-gray-400 text-lg animate-pulse">No question available</div>

    return (
      <div className="mb-8 transform transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-semibold mb-6 text-purple-300 tracking-wide">
          <span className="text-purple-400">Q{currentQuestion + 1}:</span> {question.question}
        </h3>

        {question.type === "mcq" ? (
          <div className="space-y-4">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <input
                  type="radio"
                  id={`option-${optionIndex}`}
                  name={`question-${currentQuestion}`}
                  value={optionIndex}
                  checked={answers[currentQuestion] === optionIndex.toString()}
                  onChange={() => handleAnswerChange(optionIndex.toString())}
                  className="mr-3 h-5 w-5 text-purple-500 focus:ring-purple-600 accent-purple-500 cursor-pointer"
                />
                <label
                  htmlFor={`option-${optionIndex}`}
                  className="text-gray-200 text-lg cursor-pointer hover:text-purple-300 transition-colors duration-150"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <input
                type="radio"
                id="true-option"
                name={`question-${currentQuestion}`}
                value="true"
                checked={answers[currentQuestion] === "true"}
                onChange={() => handleAnswerChange("true")}
                className="mr-3 h-5 w-5 text-purple-500 focus:ring-purple-600 accent-purple-500 cursor-pointer"
              />
              <label
                htmlFor="true-option"
                className="text-gray-200 text-lg cursor-pointer hover:text-purple-300 transition-colors duration-150"
              >
                True
              </label>
            </div>
            <div className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <input
                type="radio"
                id="false-option"
                name={`question-${currentQuestion}`}
                value="false"
                checked={answers[currentQuestion] === "false"}
                onChange={() => handleAnswerChange("false")}
                className="mr-3 h-5 w-5 text-purple-500 focus:ring-purple-600 accent-purple-500 cursor-pointer"
              />
              <label
                htmlFor="false-option"
                className="text-gray-200 text-lg cursor-pointer hover:text-purple-300 transition-colors duration-150"
              >
                False
              </label>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 transform transition-all duration-300">
        {/* Header with timer */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
          <h2 className="text-3xl font-bold text-purple-400 tracking-tight animate-fade-in">
            Online Quiz
          </h2>
          <div className="flex items-center space-x-4">
            <div
              className={`text-xl font-mono tracking-wider ${
                timeLeft < 300
                  ? "text-red-500 animate-pulse"
                  : timeLeft < 600
                  ? "text-orange-400"
                  : "text-purple-300"
              }`}
            >
              <span className="font-semibold">Time Left: </span>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Question navigation sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="bg-gray-850 p-6 rounded-xl border border-gray-700 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-300 tracking-wide">
                Question Navigator
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 transform hover:scale-110
                      ${
                        currentQuestion === index
                          ? "bg-purple-600 text-white shadow-lg"
                          : answers[index]
                          ? "bg-purple-900 text-purple-200 border border-purple-500 hover:bg-purple-800"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2 font-medium tracking-wide">
                  Progress: {countAttemptedQuestions()}/{questions.length}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(countAttemptedQuestions() / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 text-sm space-y-3">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gray-700 border border-gray-600 mr-2"></div>
                  <span className="text-gray-400">Not Attempted</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-purple-900 border border-purple-500 mr-2"></div>
                  <span className="text-purple-300">Attempted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="bg-gray-850 p-8 rounded-xl border border-gray-700 shadow-lg">
              {renderQuestion()}

              <div className="flex justify-between items-center mt-8">
                <div className="flex space-x-4">
                  <button
                    onClick={() => goToQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
                      ${
                        currentQuestion === 0
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-600 text-gray-200 hover:bg-gray-500 shadow-md"
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleClearAnswer}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    Clear
                  </button>
                </div>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => goToQuestion(currentQuestion + 1)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
                      ${
                        isSubmitting
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                      }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Test"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TakeTest