import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { fetchData } from '../../utils/api.js';

const StudentClerkRedirect = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const integrateWithBackend = async () => {
      if (!user) return;

      try {
        const clerkToken = await getToken();
        // console.log("Clerk Token:", clerkToken); // Get Clerk token
        if (!clerkToken) {
          throw new Error('Failed to retrieve Clerk token');
        }

        const payload = {
          email: user?.primaryEmailAddress?.emailAddress,
          clerk_token: clerkToken,
        };

        const data = await fetchData('/student-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        // console.log('Backend Integration Successful:', data);
        navigate('/student/dashboard');
      } catch (error) {
        console.error('Backend Integration Failed:', error.message);
        navigate('/student/login');
      }
    };

    integrateWithBackend();
  }, [user, navigate, getToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-white">Redirecting and completing setup...</p>
    </div>
  );
};

export default StudentClerkRedirect;
