import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from local storage if available
    const storedUser = localStorage.getItem('student_info');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('student_info', JSON.stringify(user));
    } else {
      localStorage.removeItem('student_info');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('student_info');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
