import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TeacherAuthProvider } from './context/TeacherAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TeacherAuthProvider>
        <App />
      </TeacherAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
