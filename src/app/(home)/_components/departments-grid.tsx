import { Department } from '@/domain/catalog/types'

export default function DepartmentsGrid({
  departments,
}: {
  departments: Department[]
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {departments.map((dept) => (
        <button
          key={dept.id}
          className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl px-2 py-3.5 flex flex-col items-center gap-2 hover:border-[var(--color-bg-elevated)] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 bg-[var(--color-brand)] rounded-full flex items-center justify-center">
            <i
              className={`ti ${dept.icon} text-xl text-[var(--color-brand-dark)]`}
              aria-hidden="true"
            />
          </div>
          <span className="text-xs text-[var(--color-text-secondary)] text-center leading-tight">
            {dept.label}
          </span>
        </button>
      ))}
    </div>
  )
}
