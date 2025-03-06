import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrophy, FaArrowLeft, FaUserAlt } from 'react-icons/fa';

const Leader = () => {
  const { testId } = useParams(); // Get the test ID from the URL
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/student/leaderboard/${testId}`, {
          method: 'GET',
          headers: {
            'Authorization': localStorage.getItem('token'), // Include the token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data.leaderboard);
        } else {
          console.error('Failed to fetch leaderboard');
          alert('Unable to fetch leaderboard. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading leaderboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 flex items-center justify-center gap-3">
          <FaTrophy className="text-yellow-400" /> Leaderboard
        </h1>
        <h2 className="text-xl font-semibold text-center mb-8">
          <span className="text-gray-400">Test ID:</span> {testId}
        </h2>

        {leaderboardData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border-collapse border border-gray-700">
              <thead>
                <tr className="bg-gray-700 text-gray-300">
                  <th className="border border-gray-700 px-6 py-3 text-left">Rank</th>
                  <th className="border border-gray-700 px-6 py-3 text-left">Student Name</th>
                  <th className="border border-gray-700 px-6 py-3 text-left">Score</th>
                  <th className="border border-gray-700 px-6 py-3 text-left">Submission Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-700">
                    <td className="border border-gray-700 px-6 py-4">{entry.rank}</td>
                    <td className="border border-gray-700 px-6 py-4">{entry.student_name}</td>
                    <td className="border border-gray-700 px-6 py-4">{entry.score}</td>
                    <td className="border border-gray-700 px-6 py-4">
                      {new Date(entry.submission_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">No data available for this leaderboard.</p>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transform hover:scale-105 transition duration-300"
          >
            <FaArrowLeft className="text-xl" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leader;
