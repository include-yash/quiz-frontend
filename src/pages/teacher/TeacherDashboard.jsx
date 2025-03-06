import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeacherAuthContext } from '../../context/TeacherAuthContext'; // Import TeacherAuthContext
import { FaUser, FaPlusCircle, FaEye } from 'react-icons/fa'; // Import icons

const TeacherDashboard = () => {
  const { user } = useContext(TeacherAuthContext); // Access the teacher details from TeacherAuthContext
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay for demonstration
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleCreateTest = () => {
    navigate('/teacher/create-test');
  };

  const handleViewTest = () => {
    navigate('/teacher/view-tests');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user || !user.teacher_details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <p>No teacher data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Teacher Dashboard</h1>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUser className="text-green-500" /> Profile
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium">Name:</h3>
            <p className="text-gray-400">{user.teacher_details.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Email:</h3>
            <p className="text-gray-400">{user.teacher_details.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Department:</h3>
            <p className="text-gray-400">{user.teacher_details.department}</p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaPlusCircle className="text-blue-500" /> Actions
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={handleCreateTest}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 text-lg"
          >
            <FaPlusCircle className="text-xl" /> Create Test
          </button>

          <button
            onClick={handleViewTest}
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition duration-300 text-lg"
          >
            <FaEye className="text-xl" /> View Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
