import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaListAlt, FaCrown, FaArrowLeft } from 'react-icons/fa';

function ViewTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token-teach');

    if (!token) {
      setError('No token found. Please log in again.');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:5000/teacher/displayquiz', {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes.');
        }
        return response.json();
      })
      .then((data) => {
        setTests(data.quizzes || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200">
      <div className="w-full max-w-4xl p-8 rounded-xl shadow-2xl bg-gray-800">
        <h2 className="text-4xl font-extrabold mb-8 flex items-center gap-2 text-center justify-center">
          <FaListAlt className="text-blue-500 glow-sm" /> View Tests
        </h2>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse text-lg">
            Loading...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul className="space-y-8">
            {tests.length > 0 ? (
              tests.map((test) => (
                <li
                  key={test.id}
                  className="p-6 bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">
                    {test.quiz_name}
                  </h3>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold">Batch Year:</span>{' '}
                    {test.batch_year}
                  </p>
                  <p className="text-lg text-gray-300">
                    <span className="font-semibold">Department:</span>{' '}
                    {test.department}
                  </p>
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() =>
                        navigate(`/teacher/leaderboard/${test.id}`)
                      }
                      className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:shadow-lg hover:bg-blue-600 transform hover:scale-105 transition duration-300"
                    >
                      <FaCrown /> Leaderboard
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/teacher/tab-switch/${test.id}`)
                      }
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:shadow-lg hover:bg-green-600 transform hover:scale-105 transition duration-300"
                    >
                      <FaListAlt /> Tab Switch
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400 text-lg">
                No tests available.
              </p>
            )}
          </ul>
        )}

        {/* Updated Greyish Back to Dashboard Button */}
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="w-full flex items-center justify-center gap-3 py-3 mt-8 bg-gray-600 text-white text-lg font-semibold rounded-md shadow-md border border-gray-500 hover:shadow-lg hover:bg-gray-700 transform hover:scale-105 hover:border-gray-600 transition duration-300"
        >
          <FaArrowLeft className="text-xl" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ViewTests;
