// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'; // Importing icons

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-black text-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-extrabold text-white">Quizrr</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center w-full max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Welcome to Quizrr</h2>
        <p className="text-xl font-medium text-gray-300 mb-8">Select your role to get started</p>

        {/* Login Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 w-full px-4">
          <button
            className="bg-gray-800 text-white p-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            onClick={() => navigate('/student/login')}
          >
            <div className="flex flex-col items-center">
              <FaUserGraduate className="text-5xl mb-4" />
              <h2 className="text-xl font-semibold">Student Login</h2>
            </div>
          </button>
          <button
            className="bg-gray-800 text-white p-8 rounded-xl shadow-lg hover:bg-green-700 transition-all transform hover:scale-105"
            onClick={() => navigate('/teacher/login')}
          >
            <div className="flex flex-col items-center">
              <FaChalkboardTeacher className="text-5xl mb-4" />
              <h2 className="text-xl font-semibold">Teacher Login</h2>
            </div>
          </button>
        </div>
      </div>

      {/* Footer or Additional Content */}
      <div className="p-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 Quizrr. All rights reserved.</p>
      </div>
    </div>
  );
}

export default HomePage;
