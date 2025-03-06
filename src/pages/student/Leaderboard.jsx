import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa'; // Trophy icon for competitive look
import { fetchData } from '../../utils/api'; // Import the fetchData utility

const Leaderboard = () => {
  const { testId } = useParams(); // Get the test ID from the URL
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await fetchData(`/student/leaderboard/${testId}`, {
          method: 'GET',
        });

        setLeaderboardData(data.leaderboard);
      } catch (error) {
        console.error('Error:', error);
        alert('Unable to fetch leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [testId]);

  if (loading) {
    return <p className="text-center text-white text-xl">Loading leaderboard...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-bold text-green-500">Leaderboard</h1>
          <FaTrophy className="text-yellow-500 text-5xl" />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-gray-400">Test ID: {testId}</h2>

        {leaderboardData.length > 0 ? (
          <table className="table-auto w-full border-collapse text-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="border-b border-gray-700 px-6 py-4 text-left text-white">Rank</th>
                <th className="border-b border-gray-700 px-6 py-4 text-left text-white">Student Name</th>
                <th className="border-b border-gray-700 px-6 py-4 text-left text-white">Score</th>
                <th className="border-b border-gray-700 px-6 py-4 text-left text-white">Submission Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-gray-700 ${index === 0 ? 'bg-gray-800' : ''}`}
                >
                  <td className="border-b border-gray-700 px-6 py-4 text-white">{entry.rank}</td>
                  <td className="border-b border-gray-700 px-6 py-4 text-white">{entry.student_name}</td>
                  <td className="border-b border-gray-700 px-6 py-4 text-white">{entry.score}</td>
                  <td className="border-b border-gray-700 px-6 py-4 text-white">
                    {new Date(entry.submission_time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 text-lg">No data available for this leaderboard.</p>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;