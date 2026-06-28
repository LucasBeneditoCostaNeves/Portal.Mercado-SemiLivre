function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-bg-elevated)] rounded-lg ${className ?? ''}`}
    />
  )
}

function CardSkeleton() {
  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col gap-2">
      <SkeletonBlock className="w-full aspect-square rounded-lg mb-1" />
      <SkeletonBlock className="h-3 w-10 rounded" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-4/5" />
      <SkeletonBlock className="h-5 w-2/5" />
      <SkeletonBlock className="h-3 w-1/3" />
    </div>
  )
}

export default function BuscarLoading() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <SkeletonBlock className="h-5 w-56" />
      <div className="flex gap-6">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="flex flex-col gap-4">
            <SkeletonBlock className="h-6 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-full" />
            ))}
            <SkeletonBlock className="h-px w-full" />
            <SkeletonBlock className="h-6 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-3/4" />
            ))}
          </div>
        </aside>
        <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
