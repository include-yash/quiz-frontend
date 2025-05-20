import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { fetchData } from '../../utils/api';
import { useToast } from '../../components/ui/toast';
import { GoogleLogin } from '@react-oauth/google';


function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleGoogleLogin = async (credentialResponse) => {
  const token = credentialResponse.credential;

  if (!token) {
    console.error("Missing Google credential");
    addToast("Google login failed: No token", { type: "error" });
    return;
  }

  try {
    const data = await fetchData('/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (data?.new_user) {
      navigate(`/student/signup`);
    } else {
      setUser({
        token: data.token,
        student_details: data.student_details,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('studentDetails', JSON.stringify(data.student_details));

      addToast('Google Login successful! Redirecting to dashboard...', { type: 'success' });
      navigate('/student/dashboard');
    }

  } catch (error) {
    console.error('Google Login Error:', error.message);
    addToast('Google Login failed. Try again later.', { type: 'error' });
  }
};

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic client-side validation
      if (!email || !password) {
        addToast('Please enter both email and password', { type: 'error' });
        setIsLoading(false);
        return;
      }

      const data = await fetchData('/student-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const { message, student_details, token } = data;
      
      // Update user context
      setUser({ 
        token, 
        student_details: {
          ...student_details,
          usn: student_details.usn || ''
        } 
      });

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('studentDetails', JSON.stringify({
        ...student_details,
        usn: student_details.usn || ''
      }));

      addToast('Login successful! Redirecting to dashboard...', { type: 'success' });
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('401')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      addToast(errorMessage, { 
        type: 'error',
        duration: 5000 // Show for 5 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-black to-black flex justify-center items-center text-white">
      <div className="max-w-md w-full p-8 bg-gray-900 shadow-xl rounded-lg">
        <h2 className="text-4xl font-semibold text-center text-white mb-8">Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-lg">Email</label>
            <input
              type="email"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-lg">Password</label>
            <input
              type="password"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-all flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => addToast('Google Login failed', { type: 'error' })}
          />
        </div>


        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/student/signup" className="text-purple-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
