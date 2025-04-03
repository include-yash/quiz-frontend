"use client"
import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "../../lib/utils"

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

// Modern toast types with better contrast
const TOAST_TYPES = {
  success: { 
    icon: CheckCircle2, 
    className: "bg-green-600 text-white border-green-700",
    iconClassName: "text-green-100"
  },
  error: { 
    icon: AlertCircle, 
    className: "bg-red-600 text-white border-red-700",
    iconClassName: "text-red-100" 
  },
  warning: { 
    icon: AlertTriangle, 
    className: "bg-amber-500 text-white border-amber-600",
    iconClassName: "text-amber-100"
  },
  info: { 
    icon: Info, 
    className: "bg-blue-600 text-white border-blue-700",
    iconClassName: "text-blue-100"
  },
}

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

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed inset-4 z-50 pointer-events-none flex flex-col items-end p-4 gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const Toast = ({ toast, onClose }) => {
  const { id, message, type, duration } = toast
  const { icon: Icon, className, iconClassName } = TOAST_TYPES[type] || TOAST_TYPES.info

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "pointer-events-auto relative flex items-start w-full max-w-sm p-4",
        "rounded-lg border shadow-lg",
        "transition-all duration-200 ease-in-out",
        className
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconClassName)} />
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 -mt-1 -mr-1 hover:bg-white/20 transition-colors"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      {duration && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
        />
      )}
    </motion.div>
  )
}