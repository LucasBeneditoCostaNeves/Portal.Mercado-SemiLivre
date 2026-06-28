'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SORT_OPTIONS } from '@/types/search'

export default function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') ?? ''
  const currentOrder = searchParams.get('order') ?? ''

  const currentValue = SORT_OPTIONS.findIndex(
    (o) => (o.sort ?? '') === currentSort && (o.order ?? '') === currentOrder
  )
  const selectedIndex = currentValue === -1 ? 0 : currentValue

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const option = SORT_OPTIONS[Number(e.target.value)]
    const params = new URLSearchParams(searchParams.toString())
    if (option.sort) {
      params.set('sort', option.sort)
      params.set('order', option.order ?? 'asc')
    } else {
      params.delete('sort')
      params.delete('order')
    }
    router.replace(`/buscar?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap"
      >
        Ordenar por
      </label>
      <select
        id="sort-select"
        value={selectedIndex}
        onChange={handleChange}
        className="text-sm bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-1.5 outline-none cursor-pointer"
      >
        {SORT_OPTIONS.map((option, i) => (
          <option key={i} value={i}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
