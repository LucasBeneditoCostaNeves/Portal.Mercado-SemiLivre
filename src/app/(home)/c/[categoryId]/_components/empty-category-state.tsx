'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  label: string
  hasFilters: boolean
}

export default function EmptyCategoryState({ label, hasFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function clearFilters() {
    router.replace(pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <i
        className="ti ti-search-off text-5xl text-[var(--color-text-secondary)]"
        aria-hidden="true"
      />
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        {hasFilters
          ? 'Nenhum produto encontrado com os filtros selecionados'
          : `Nenhum produto encontrado em ${label}`}
      </h2>
      {hasFilters ? (
        <button
          onClick={clearFilters}
          className="h-10 px-6 bg-[var(--color-brand)] text-[var(--color-brand-dark)] text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Limpar filtros
        </button>
      ) : (
        <Link
          href="/"
          className="h-10 px-6 bg-[var(--color-brand)] text-[var(--color-brand-dark)] text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center"
        >
          Voltar para a home
        </Link>
      )}
    </div>
  )
}
