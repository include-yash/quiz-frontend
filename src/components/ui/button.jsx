import React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    const variants = {
      default: "bg-quiz-purple-600 text-white hover:bg-quiz-purple-700 shadow-md shadow-quiz-purple-900/20",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-900/20",
      outline: "border border-quiz-purple-900/20 bg-transparent hover:bg-quiz-purple-600/20 text-white",
      secondary: "bg-quiz-dark-50 text-white hover:bg-quiz-dark-100 shadow-md shadow-black/20",
      ghost: "hover:bg-quiz-purple-600/20 text-white",
      link: "text-quiz-purple-400 underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2 rounded-md",
      sm: "h-8 rounded-md px-3 text-sm",
      lg: "h-12 rounded-md px-8 text-lg",
      icon: "h-10 w-10 rounded-full",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quiz-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

Button.displayName = "Button"

export default Button

