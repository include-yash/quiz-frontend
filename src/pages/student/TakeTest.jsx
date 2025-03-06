import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaClock, FaPlay, FaCheckCircle } from 'react-icons/fa';
import { fetchData } from '../../utils/api'; // Import fetchData utility

const TakeTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  const initialTimer = location.state?.selectedTest?.timer * 60 || 120; // Timer in seconds
  let questions = location.state?.parsedQuestions || []; // Questions array
  const quiz_id = location.state?.selectedTest?.id;
  const [timeLeft, setTimeLeft] = useState(initialTimer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0); // Score state
  const [attemptedQuestions, setAttemptedQuestions] = useState(0); // Number of attempted questions
  const [isTestStarted, setIsTestStarted] = useState(false); // Track if the test has started
  const [isTestFinished, setIsTestFinished] = useState(false); // Track if the test is finished

  useEffect(() => {
    const checkIfQuizAlreadyAttempted = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found.");
          alert("You must be logged in to start the test.");
          navigate('/student/login', { replace: true });
          return;
        }

        // Fetch attempted quizzes
        const result = await fetchData('/student/get-quiz-id', {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });

        const attemptedQuizIds = result.quiz_ids || [];
        if (attemptedQuizIds.includes(quiz_id)) {
          // If quiz has already been attempted, redirect to the dashboard
          console.warn('Quiz already attempted, redirecting to dashboard');
          navigate('/student/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking quiz attempt:', error);
        alert(`An error occurred while checking quiz status: ${error.message}`);
      }
    };

    // Only check if there are questions and the timer is valid
    if (questions.length && initialTimer > 0) {
      checkIfQuizAlreadyAttempted();
    } else {
      console.error('Invalid test data. Redirecting to dashboard.');
      navigate('/student/dashboard');
    }

    // Cleanup when the component is unmounted
    return () => {};
  }, [questions.length, initialTimer, navigate, quiz_id]);

  // Trigger fullscreen after user interacts with the page
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  };

  // Handle starting the test
  const handleStartTest = () => {
    setIsTestStarted(true); // Mark the test as started
    enterFullscreen(); // Enter fullscreen after the test has started
    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(score, attemptedQuestions); // Submit automatically when time is up
          setIsTestFinished(true); // Mark test as finished
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  };

  // Handle answer change
  const handleAnswerChange = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let updatedScore = score;
    let updatedAttemptedQuestions = attemptedQuestions;

    // Check the answer and update the score
    if (currentQuestion.type === 'mcq') {
      if (selectedAnswer === currentQuestion.options[currentQuestion.correctOption]) {
        updatedScore += 1;
      }
    } else if (currentQuestion.type === 'true-false') {
      if ((selectedAnswer === 'true' ? true : false) === currentQuestion.correctAnswer) {
        updatedScore += 1;
      }
    }

    // Update attempted questions count
    updatedAttemptedQuestions += 1;

    // Move to the next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Increment question index
      setSelectedAnswer(''); // Reset selected answer for the next question
    } else {
      handleSubmit(updatedScore, updatedAttemptedQuestions); // Submit if it's the last question
      setIsTestFinished(true); // Mark test as finished
      return; // Prevent further state updates after submission
    }

    // Set state after handling the question
    setScore(updatedScore);
    setAttemptedQuestions(updatedAttemptedQuestions);
  };

  const handleSubmit = async (finalScore, finalAttemptedQuestions) => {
    try {
      console.log("quiz_id", quiz_id);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found.");
        alert("You must be logged in to submit the test.");
        navigate('/student/login', { replace: true });
        return;
      }

      const result = await fetchData('/student/get-quiz-id', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      const attemptedQuizIds = result.quiz_ids || [];
      if (attemptedQuizIds.includes(quiz_id)) {
        // If the quiz has already been attempted, redirect to the dashboard
        console.warn('Quiz already attempted, redirecting to dashboard');
        navigate('/student/dashboard', { replace: true });
        return;
      }

      // Step 2: Set the questions to null or prevent further attempts
      questions = []; // Simply set an empty array or prevent further use

      // Step 3: Proceed with score submission if the quiz has not been attempted
      const payload = {
        quiz_id: quiz_id,
        score: finalScore,
      };

      // Step 4: Save the score in the backend
      await fetchData('/student/savescore', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      // Step 5: Navigate to the success page after saving the score
      navigate('/student/success', {
        state: {
          totalQuestions: questions.length,
          attemptedQuestions: finalAttemptedQuestions,
          score: finalScore,
        },
      }, { replace: true });

      // Exit fullscreen mode after submitting the test
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }

    } catch (error) {
      console.error('Unexpected error occurred:', error);
      alert(`An unexpected error occurred: ${error.message || error}`);
    }
  };

  // Current question to display
  const currentQuestion = questions[currentQuestionIndex];

  // Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = async () => {  // Get quiz_id from localStorage
      const token = localStorage.getItem('token');    // Get student token from localStorage
  
      try {
        await fetchData('/student/add-tab-switch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,  // Pass the token as Authorization header
          },
          body: JSON.stringify({
            quiz_id: quiz_id,  // Pass the quiz_id
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
  
      if (document.hidden) {
        alert("You've switched to another tab!"); // Alert when tab is switched
      } 
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Timer Section */}
      {isTestStarted && (
        <div className="bg-blue-800 text-white text-2xl p-4 text-center flex justify-center items-center">
          <FaClock className="mr-2" />
          Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-grow items-center justify-center">
        {/* Start Test Button */}
        {!isTestStarted && (
          <div className="text-center">
            <button
              onClick={handleStartTest}
              className="bg-green-600 text-white px-8 py-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2 text-3xl"
            >
              <FaPlay />
              <span>Start Test</span>
            </button>
          </div>
        )}

        {/* Show the test content only after the test has started */}
        {isTestStarted && (
          <>
            {/* Question Section */}
            <div className="w-full max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-8 mt-6 h-full flex flex-col justify-between">
              <h2 className="text-3xl font-semibold mb-6 text-green-500">Question {currentQuestionIndex + 1}</h2>
              <p className="text-xl">{currentQuestion.question}</p>

              {/* Answer Input for different question types */}
              {currentQuestion.type === 'mcq' && (
                <div className="grid grid-cols-2 gap-6 mt-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(option)}
                      className={`p-4 border-2 border-gray-300 rounded-md text-lg text-white hover:bg-blue-500 hover:text-white ${selectedAnswer === option ? 'bg-blue-500' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="mt-6 text-lg grid grid-cols-2 gap-6">
                  <button
                    onClick={() => handleAnswerChange('true')}
                    className={`p-4 border-2 border-gray-300 rounded-md text-lg text-white hover:bg-blue-500 hover:text-white ${selectedAnswer === 'true' ? 'bg-blue-500' : ''}`}
                  >
                    True
                  </button>
                  <button
                    onClick={() => handleAnswerChange('false')}
                    className={`p-4 border-2 border-gray-300 rounded-md text-lg text-white hover:bg-blue-500 hover:text-white ${selectedAnswer === 'false' ? 'bg-blue-500' : ''}`}
                  >
                    False
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 text-xl"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-xl"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TakeTest;