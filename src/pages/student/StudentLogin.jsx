import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext); // Access AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { message, student_details, token } = data;
        console.log('Data:', data);
        // Save user details and token to global context
        setUser({ token, student_details });

        // Save token to localStorage for persistent session
        localStorage.setItem('token', token);
        localStorage.setItem('studentDetails', JSON.stringify(student_details));  // Optionally store details too

        console.log('Login successful:', token, student_details);

        // Redirect to the dashboard
        navigate('/student/dashboard');
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
    <div className="h-screen bg-black flex justify-center items-center text-white">
      <div className="max-w-md w-full p-8 bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-3xl text-center text-white mb-6">Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/student/signup" className="text-blue-500">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
