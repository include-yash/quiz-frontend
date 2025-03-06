import React, { createContext, useState, useEffect } from 'react';

export const TeacherAuthContext = createContext();

export const TeacherAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from local storage if available
    const storedUser = localStorage.getItem('teacherDetails');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('teacherDetails', JSON.stringify(user));
    } else {
      localStorage.removeItem('teacherDetails');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teacherDetails');
  };

  return (
    <TeacherAuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </TeacherAuthContext.Provider>
  );
};
