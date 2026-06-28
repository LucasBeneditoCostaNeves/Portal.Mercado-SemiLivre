type Props = {
  label: string
  total: number
}

export default function CategoryHeader({ label, total }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
        {label}
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
        {total} {total === 1 ? 'produto' : 'produtos'}
      </p>
    </div>
  )
}
