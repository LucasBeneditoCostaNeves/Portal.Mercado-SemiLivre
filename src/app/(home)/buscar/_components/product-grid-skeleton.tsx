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

type Props = {
  count?: number
}

export default function ProductGridSkeleton({ count = 5 }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
