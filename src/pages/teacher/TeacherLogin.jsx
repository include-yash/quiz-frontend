import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeacherAuthContext } from '../../context/TeacherAuthContext'; // Import TeacherAuthContext

function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(TeacherAuthContext); // Access TeacherAuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/teacher-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { message, teacher_details, token } = data;
        console.log('Data:', data);

        // Save user details and token to global context (Teacher context)
        setUser({ token, teacher_details });

        // Save token to localStorage for persistent session
        localStorage.setItem('token-teach', token);
        localStorage.setItem('teacher_info', JSON.stringify(teacher_details));

        console.log('Login successful:', token, teacher_details);

        // Redirect to the teacher dashboard
        navigate('/teacher/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-gray-800 p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl text-center text-green-400 font-bold mb-6">Teacher Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <a
            href="/teacher/signup"
            className="text-green-400 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default TeacherLogin;
