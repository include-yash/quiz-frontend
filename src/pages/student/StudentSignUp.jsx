import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../utils/api.js'; // Import the fetchData utility

function StudentSignUp() {
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    const payload = { email, section, password }; // Remove `department`
    console.log('Payload:', payload);
  
    try {
      const data = await fetchData('/signup/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      console.log('Sign-up successful');
      navigate('/student/login');
    } catch (error) {
      console.error('Error during sign-up:', error.message || 'Unknown error');
      alert('Sign-up failed: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <section className="h-screen bg-black flex justify-center items-center py-12">
      <div className="max-w-lg w-full bg-gray-900 p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Student Sign Up</h2>
        <form onSubmit={handleSignUp}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Department Input */}
          <div className="mb-6">
            <label htmlFor="department" className="block text-gray-300 mb-2">Department</label>
            <input
              type="text"
              id="department"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          {/* Section Dropdown */}
          <div className="mb-6">
            <label htmlFor="section" className="block text-gray-300 mb-2">Section</label>
            <select
              id="section"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Sign Up
          </button>

          {/* Redirect to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/student/login')}
                className="text-blue-500 font-semibold hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default StudentSignUp;