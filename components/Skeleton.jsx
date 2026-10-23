export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}

export function StorefrontSkeleton() {
  return (
    <div className="p-4 space-y-8" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <Skeleton className="hidden sm:block sm:col-span-3 h-80" />
        <Skeleton className="sm:col-span-6 h-80" />
        <Skeleton className="hidden sm:block sm:col-span-3 h-80" />
      </div>
      <Skeleton className="h-40" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
