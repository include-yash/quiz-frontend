import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "border-transparent bg-quiz-purple-600 text-white": variant === "default",
        "border-transparent bg-primary text-primary-foreground": variant === "secondary",
        "border-transparent bg-destructive text-destructive-foreground": variant === "destructive",
        "border-transparent bg-green-500 text-white": variant === "success",
      },
      className
    )}
    {...props}
  />
))

Badge.displayName = "Badge"

export { Badge }