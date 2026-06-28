'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ReviewFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <select
        value={searchParams.get('sort') ?? 'recent'}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-1.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] cursor-pointer"
        aria-label="Ordenar avaliações"
      >
        <option value="recent">Ordenar: Mais recentes</option>
        <option value="top">Ordenar: Melhor avaliadas</option>
      </select>

      <select
        value={searchParams.get('rating') ?? ''}
        onChange={(e) => updateParam('rating', e.target.value || null)}
        className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-1.5 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] cursor-pointer"
        aria-label="Filtrar por qualificação"
      >
        <option value="">Qualificação: Todas</option>
        <option value="5">5 estrelas</option>
        <option value="4">4 estrelas</option>
        <option value="3">3 estrelas</option>
        <option value="2">2 estrelas</option>
        <option value="1">1 estrela</option>
      </select>
    </div>
  )
}
