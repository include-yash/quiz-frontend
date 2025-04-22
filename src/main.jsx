import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TeacherAuthProvider } from './context/TeacherAuthContext.jsx';
import './index.css';
import {ToastProvider} from "./components/ui/toast.jsx"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Ensure that createRoot is correctly used
const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AuthProvider>
          <TeacherAuthProvider>
          <ToastProvider>
            <App />
            </ToastProvider>
          </TeacherAuthProvider>
        </AuthProvider>
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
