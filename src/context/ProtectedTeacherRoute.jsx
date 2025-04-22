import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TeacherAuthContext } from '../context/TeacherAuthContext';

const ProtectedTeacherRoute = ({ children }) => {
  const { user } = useContext(TeacherAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Clear history and redirect to login page
      navigate('/teacher/login', { replace: true });
    }
  }, [user, navigate]);

  // If the user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/teacher/login" replace />;
  }

  // If the user is authenticated, render the children (protected route)
  return children;
};

export default ProtectedTeacherRoute;
