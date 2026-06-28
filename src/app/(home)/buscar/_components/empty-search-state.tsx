import Link from 'next/link'

type Props = {
  query: string
}

export default function EmptySearchState({ query }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <i
        className="ti ti-search-off text-5xl text-[var(--color-text-secondary)]"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-[var(--color-text-primary)]">
          Nenhum produto encontrado para &quot;{query}&quot;
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Verifique a ortografia ou tente outro termo
        </p>
      </div>
      <Link
        href="/"
        className="mt-2 px-6 py-2.5 rounded-lg bg-[var(--color-brand)] text-zinc-900 text-sm font-medium hover:bg-yellow-400 transition-colors"
      >
        Voltar para a home
      </Link>
    </div>
  )
}
