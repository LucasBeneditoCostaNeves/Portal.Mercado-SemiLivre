export default function CategoryLoading() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
      <div className="h-8 w-40 bg-[var(--color-surface-card)] rounded animate-pulse mb-1" />
      <div className="h-4 w-24 bg-[var(--color-surface-card)] rounded animate-pulse mb-6" />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">
        <div className="hidden lg:block w-56 shrink-0 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-5 bg-[var(--color-surface-card)] rounded animate-pulse"
            />
          ))}
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl aspect-square animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  )
}
