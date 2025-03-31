"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const TestPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const questions = location.state?.parsedQuestions || []
  const quiz_id = location.state?.selectedTest?.id
  const timerDuration = location.state?.selectedTest?.timer || 60 // Default 60 minutes if not provided

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(""))
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60) // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerRef = useRef(null)

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
  }, [timerDuration, isSubmitting, answers]);
  

  // Count attempted questions
  const countAttemptedQuestions = () => {
    return answers.filter((answer) => answer !== "").length
  }

  // Calculate score
  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (question.type === "mcq") {
        if (Number.parseInt(answers[index]) === question.correctOption) {
          score++
        }
      } else if (question.type === "true-false") {
        const boolAnswer = answers[index] === "true"
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
  
    // Calculate the score using the latest answers
    const finalScore = calculateScore();
    const finalAttempted = countAttemptedQuestions();
  
    try {
      const token = localStorage.getItem("token");
      const controller = new AbortController();
  
      const response = await fetch(`http://127.0.0.1:10000/student/savescore`, {
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
            answers: answers,
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
    if (!question) return <div>No question available</div>

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">
          Question {currentQuestion + 1}: {question.question}
        </h3>

        {question.type === "mcq" ? (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${optionIndex}`}
                  name={`question-${currentQuestion}`}
                  value={optionIndex}
                  checked={answers[currentQuestion] === optionIndex.toString()}
                  onChange={() => handleAnswerChange(optionIndex.toString())}
                  className="mr-2"
                />
                <label htmlFor={`option-${optionIndex}`} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="true-option"
                name={`question-${currentQuestion}`}
                value="true"
                checked={answers[currentQuestion] === "true"}
                onChange={() => handleAnswerChange("true")}
                className="mr-2"
              />
              <label htmlFor="true-option" className="text-gray-700">
                True
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="false-option"
                name={`question-${currentQuestion}`}
                value="false"
                checked={answers[currentQuestion] === "false"}
                onChange={() => handleAnswerChange("false")}
                className="mr-2"
              />
              <label htmlFor="false-option" className="text-gray-700">
                False
              </label>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header with timer */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold">Online Test</h2>
          <div className="flex items-center">
            <div className={`text-xl font-mono ${timeLeft < 300 ? "text-red-600" : "text-gray-800"}`}>
              Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Question navigation sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm
                      ${
                        currentQuestion === index
                          ? "bg-blue-600 text-white"
                          : answers[index]
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-sm">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 rounded-full bg-gray-200 mr-2"></div>
                  <span>Not Attempted</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                  <span>Attempted</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm mb-1">Progress:</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(countAttemptedQuestions() / questions.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  {countAttemptedQuestions()} of {questions.length} questions answered
                </p>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:w-3/4">
            {renderQuestion()}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded ${
                  currentQuestion === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
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
  )
}

export default TestPage

