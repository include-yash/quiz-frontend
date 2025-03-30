"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "react-feather"
import { cn } from "../../lib/utils"

// Toast context
const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

// Toast types and their corresponding icons
const TOAST_TYPES = {
  success: { icon: CheckCircle, className: "bg-green-900/20 text-green-500 border-green-500/20" },
  error: { icon: AlertCircle, className: "bg-red-900/20 text-red-500 border-red-500/20" },
  warning: { icon: AlertTriangle, className: "bg-yellow-900/20 text-yellow-500 border-yellow-500/20" },
  info: { icon: Info, className: "bg-blue-900/20 text-blue-500 border-blue-500/20" },
}

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, options = {}) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast = {
      id,
      message,
      type: options.type || "info",
      duration: options.duration || 5000,
      ...options,
    }
    setToasts((prev) => [...prev, toast])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Toast container component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Individual toast component
const Toast = ({ toast, onClose }) => {
  const { id, message, type, duration } = toast
  const { icon: Icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-start p-4 rounded-lg border shadow-lg backdrop-blur-sm", className)}
    >
      <Icon size={18} className="mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-full p-1 hover:bg-white/10 transition-colors"
        aria-label="Close toast"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

