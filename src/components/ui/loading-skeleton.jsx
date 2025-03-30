import Skeleton from "./skeleton"

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

export const TestListSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />

      <div className="space-y-2">
        <Skeleton className="h-12 rounded-md" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-md" />
        ))}
      </div>
    </div>
  )
}

export const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 rounded-md" />
        ))}
      </div>

      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  )
}

