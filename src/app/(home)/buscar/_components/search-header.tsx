type Props = {
  query: string
  total: number
}

export default function SearchHeader({ query, total }: Props) {
  return (
    <div className="flex items-baseline gap-2">
      <h1 className="text-base text-[var(--color-text-secondary)]">
        <span className="font-medium text-[var(--color-text-primary)]">
          {total.toLocaleString('pt-BR')}
        </span>{' '}
        {total === 1 ? 'resultado' : 'resultados'} para{' '}
        <span className="font-medium text-[var(--color-text-primary)]">
          &quot;{query}&quot;
        </span>
      </h1>
    </div>
  )
}
