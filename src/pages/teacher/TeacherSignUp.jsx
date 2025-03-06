import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../utils/api';

function TeacherSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const payload = { email, password };
    console.log('Payload:', payload);

    try {
      const data = await fetchData('https://quiz-backend-5k98.onrender.com/signup/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Sign-up successful', data);
      alert('Sign-up successful! Please log in.');
      navigate('/teacher/login');
    } catch (error) {
      console.error('Error during sign-up:', error.message);
      alert('Sign-up failed: ' + error.message);
    }
  };

  return (
    <section className="bg-gray-900 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-lg w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-6">Teacher Sign Up</h2>
        <form onSubmit={handleSignUp}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
            Sign Up
          </button>

          {/* Redirect to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/teacher/login')}
                className="text-green-400 font-semibold hover:underline"
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

export default TeacherSignUp;
