import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Icon for success
import { AiOutlineHome } from 'react-icons/ai'; // Home icon

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract data from location state
  const { totalQuestions, attemptedQuestions, score } = location.state || {};

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Results Box in Block Layout */}
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-lg w-full text-left border-2 border-gray-700">
        <div className="flex items-center mb-6">
          <FaCheckCircle className="text-green-400 text-3xl mr-4" />
          <h2 className="text-3xl font-semibold text-green-400">Test Completed</h2>
        </div>
        <p className="text-lg text-gray-300 mb-6">Thank you for completing the test!</p>

        {/* Display Results */}
        <div className="text-lg text-gray-400 mb-6">
          <p><strong>Score:</strong> <span className="text-white">{score || 0}</span></p>
          <p><strong>Questions Attempted:</strong> <span className="text-white">{attemptedQuestions || 0}</span></p>
          <p><strong>Total Questions:</strong> <span className="text-white">{totalQuestions || 0}</span></p>
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigate('/student/dashboard', { replace: true })}
          className="flex items-center bg-green-400 text-white px-6 py-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
        >
          <AiOutlineHome className="mr-2 text-xl" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
