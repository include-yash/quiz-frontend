import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component to handle dynamic title changes
function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      '/dashboard': 'Dashboard | Quizzer',
      '/student/dashboard': 'Student Dashboard | Quizzer',
      '/quiz': 'Take Quiz | Quizzer',
      '/profile': 'My Profile | Quizzer',
      // Add more routes as needed
    };
    
    document.title = pageTitles[location.pathname] || 'Quizzer';
  }, [location.pathname]);

  return null;
}

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing Google Client ID");
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <TitleManager /> {/* This handles dynamic title changes */}
        <AppRoutes />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
