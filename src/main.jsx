import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TeacherAuthProvider } from './context/TeacherAuthContext.jsx'
import {ToastProvider} from "./components/ui/toast.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TeacherAuthProvider>
        <ToastProvider>
        <App />
        </ToastProvider>
      </TeacherAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
