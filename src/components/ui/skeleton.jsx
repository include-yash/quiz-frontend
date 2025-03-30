import { cn } from "../../lib/utils"

const Skeleton = ({ className, ...props }) => {
  return <div className={cn("skeleton", className)} {...props} />
}

export default Skeleton

