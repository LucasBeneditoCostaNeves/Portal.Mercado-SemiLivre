function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-bg-elevated)] rounded-lg ${className ?? ''}`}
    />
  )
}

export default function ProductDetailLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-3 w-10" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-3 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 pb-6">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 shrink-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="w-12 h-12 rounded-md" />
            ))}
          </div>
          <SkeletonBlock className="flex-1 aspect-square rounded-xl" />
        </div>

        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-6 w-3/4" />
          <SkeletonBlock className="h-5 w-1/2" />
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-4 w-1/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />

          <div className="border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4">
            <SkeletonBlock className="h-9 w-2/5" />
            <SkeletonBlock className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-11 rounded-lg" />
              <SkeletonBlock className="h-11 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <SkeletonBlock className="h-40 rounded-lg" />
    </main>
  )
}
