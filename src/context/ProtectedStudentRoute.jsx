import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import StudentAuthContext

const ProtectedStudentRoute = ({ element }) => {
  const { user } = useContext(AuthContext); // Get the user from context

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/student/login" replace />;
  }

  return element;
};

export default ProtectedStudentRoute;
