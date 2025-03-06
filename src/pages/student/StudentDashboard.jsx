import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ClipboardList } from 'lucide-react';

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentDetails = JSON.parse(localStorage.getItem('studentDetails'));
    setStudentProfile(studentDetails);

    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const [quizzesResponse, attemptedResponse] = await Promise.all([
          fetch('http://127.0.0.1:5000/student', {
            method: 'GET',
            headers: { Authorization: token },
          }),
          fetch('http://127.0.0.1:5000/student/get-quiz-id', {
            method: 'GET',
            headers: { Authorization: token },
          }),
        ]);

        if (quizzesResponse.ok && attemptedResponse.ok) {
          const quizzesData = await quizzesResponse.json();
          const attemptedData = await attemptedResponse.json();

          const attemptedQuizIds = attemptedData.quiz_ids || [];
          const allQuizzes = quizzesData.quizzes || [];
          const attempted = allQuizzes.filter((quiz) =>
            attemptedQuizIds.includes(quiz.id)
          );
          const upcoming = allQuizzes.filter(
            (quiz) => !attemptedQuizIds.includes(quiz.id)
          );

          setAttemptedTests(attempted);
          setUpcomingTests(upcoming);
        } else {
          console.error('Error fetching quizzes');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAttemptTest = (test) => {
    setSelectedTest(test);
    setShowPopup(true);
  };

  const handleContinue = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/student/get-quiz-details?quiz_id=${selectedTest.id}&quiz_name=${encodeURIComponent(selectedTest.quiz_name)}`,
        {
          method: 'GET',
          headers: { Authorization: localStorage.getItem('token') },
        }
      );

      const data = await response.json();
      if (data.quiz && data.quiz.questions) {
        const parsedQuestions = JSON.parse(data.quiz.questions);
        navigate('/student/take-test', {
          state: {
            parsedQuestions,
            selectedTest,
          },
        });
      } else {
        console.error('No quiz data found');
      }
    } catch (error) {
      console.error('Error fetching quiz details:', error);
    }
  };

  const handleViewLeaderboard = (test) => {
    navigate(`/student/leaderboard/${test.id}`, { replace: true });
  };

  if (loading) {
    return <p className="text-center text-white">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-6">
      {/* Profile Section */}
      {studentProfile && (
        <div className="max-w-5xl w-full bg-gray-800 shadow-lg rounded-lg p-8 mb-10 transform transition-all hover:scale-105">
          <h1 className="text-3xl font-bold text-center mb-6">Student Dashboard</h1>
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Name:</h3>
              <p>{studentProfile.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email:</h3>
              <p>{studentProfile.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Section:</h3>
              <p>{studentProfile.section}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Department:</h3>
              <p>{studentProfile.department}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Batch Year:</h3>
              <p>{studentProfile.batch_year}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tests Section */}
      <div className="max-w-5xl w-full bg-gray-800 shadow-lg rounded-lg p-8 mb-10 transform transition-all hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <CalendarDays className="mr-2" />
          Upcoming Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingTests.length > 0 ? (
            upcomingTests.map((test) => (
              <div
                key={test.id}
                className="border p-6 rounded-md shadow-xl bg-gray-700 transform transition-all hover:scale-105"
              >
                <h3 className="text-lg font-semibold">{test.quiz_name}</h3>
                <p>Section: {test.section}</p>
                <p>Batch Year: {test.batch_year}</p>
                <p>Department: {test.department}</p>
                <div className="flex justify-end">
                  <button
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transform transition-all hover:scale-105"
                    onClick={() => handleAttemptTest(test)}
                  >
                    Attempt Test
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming tests available.</p>
          )}
        </div>
      </div>

      {/* Attempted Tests Section */}
      <div className="max-w-5xl w-full bg-gray-800 shadow-lg rounded-lg p-8 transform transition-all hover:scale-105">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <ClipboardList className="mr-2" />
          Attempted Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attemptedTests.length > 0 ? (
            attemptedTests.map((test) => (
              <div
                key={test.id}
                className="border p-6 rounded-md shadow-xl bg-gray-700 transform transition-all hover:scale-105"
              >
                <h3 className="text-lg font-semibold">{test.quiz_name}</h3>
                <p>Section: {test.section}</p>
                <p>Batch Year: {test.batch_year}</p>
                <p>Department: {test.department}</p>
                <div className="flex justify-end">
                  <button
                    className="mt-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transform transition-all hover:scale-105"
                    onClick={() => handleViewLeaderboard(test)}
                  >
                    View Leaderboard
                  </button>
                </div>
                <p className="text-green-600 font-semibold mt-2">Already Attempted</p>
              </div>
            ))
          ) : (
            <p>No attempted tests found.</p>
          )}
        </div>
      </div>

      {/* Popup Modal for Test Instructions */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all hover:scale-105">
            <h3 className="text-xl font-semibold mb-4">Test Instructions</h3>
            <p className="mb-4">
              Please read the following instructions carefully before attempting the test:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Attempt all questions within the given time.</li>
              <li>No external help is allowed during the test.</li>
              <li>You have 2 minutes to complete the test.</li>
            </ul>
            <div className="flex justify-between items-center">
              <p className="font-semibold">Time: 2:00 mins</p>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transform transition-all hover:scale-105"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
