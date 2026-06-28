'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FilterState } from '@/types/search'

type Props = {
  query: string
  availableBrands: string[]
  availableCategories: string[]
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Avaliação mínima">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? 0 : star)}
          aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
          aria-pressed={value >= star}
          className="text-lg leading-none transition-colors"
        >
          <i
            className={`ti ${value >= star ? 'ti-star-filled text-[var(--color-brand)]' : 'ti-star text-[var(--color-text-secondary)]'}`}
          />
        </button>
      ))}
    </div>
  )
}

function FilterContent({
  filters,
  setFilters,
  availableBrands,
  availableCategories,
  onApply,
  onClear,
}: {
  filters: FilterState
  setFilters: (f: FilterState) => void
  availableBrands: string[]
  availableCategories: string[]
  onApply: () => void
  onClear: () => void
}) {
  const activeCount = [
    filters.freeShipping,
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.minRating > 0,
    filters.brands.length > 0,
    filters.categories.length > 0,
  ].filter(Boolean).length

  function toggleBrand(brand: string) {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    })
  }

  function toggleCategory(cat: string) {
    setFilters({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat],
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm text-[var(--color-text-primary)]">
          Filtros
          {activeCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-[var(--color-brand)] text-zinc-900 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Entrega
        </span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.freeShipping}
            onChange={(e) =>
              setFilters({ ...filters, freeShipping: e.target.checked })
            }
            className="rounded accent-[var(--color-brand)]"
          />
          <span className="text-sm text-[var(--color-text-primary)] flex items-center gap-1">
            <i className="ti ti-truck text-emerald-400 text-xs" />
            Frete grátis
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Faixa de preço
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="w-full text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-2 py-1.5 outline-none focus:border-[var(--color-brand)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-[var(--color-text-secondary)] text-sm shrink-0">
            —
          </span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="w-full text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-2 py-1.5 outline-none focus:border-[var(--color-brand)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
          Avaliação mínima
        </span>
        <StarRating
          value={filters.minRating}
          onChange={(v) => setFilters({ ...filters, minRating: v })}
        />
      </div>

      {availableBrands.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Marca
          </span>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded accent-[var(--color-brand)]"
                />
                <span className="text-sm text-[var(--color-text-primary)]">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {availableCategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
            Categoria
          </span>
          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {availableCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded accent-[var(--color-brand)]"
                />
                <span className="text-sm text-[var(--color-text-primary)]">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onApply}
        className="w-full py-2.5 rounded-lg bg-[var(--color-brand)] text-zinc-900 text-sm font-medium hover:bg-yellow-400 transition-colors"
      >
        Aplicar filtros
      </button>
    </div>
  )
}

export default function FiltersPanel({
  query,
  availableBrands,
  availableCategories,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    freeShipping: searchParams.get('freeShipping') === 'true',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    minRating: Number(searchParams.get('minRating') ?? 0),
    brands: searchParams.get('brand')
      ? searchParams.get('brand')!.split(',')
      : [],
    categories: searchParams.get('category')
      ? searchParams.get('category')!.split(',')
      : [],
  })

  const activeCount = [
    filters.freeShipping,
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.minRating > 0,
    filters.brands.length > 0,
    filters.categories.length > 0,
  ].filter(Boolean).length

  function buildParams(f: FilterState): URLSearchParams {
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', query)
    if (f.freeShipping) params.set('freeShipping', 'true')
    else params.delete('freeShipping')
    if (f.minPrice) params.set('minPrice', f.minPrice)
    else params.delete('minPrice')
    if (f.maxPrice) params.set('maxPrice', f.maxPrice)
    else params.delete('maxPrice')
    if (f.minRating > 0) params.set('minRating', String(f.minRating))
    else params.delete('minRating')
    if (f.brands.length > 0) params.set('brand', f.brands.join(','))
    else params.delete('brand')
    if (f.categories.length > 0) params.set('category', f.categories.join(','))
    else params.delete('category')
    params.delete('offset')
    return params
  }

  function handleApply() {
    router.replace(`/buscar?${buildParams(filters).toString()}`, {
      scroll: false,
    })
    setDrawerOpen(false)
  }

  function handleClear() {
    const cleared: FilterState = {
      freeShipping: false,
      minPrice: '',
      maxPrice: '',
      minRating: 0,
      brands: [],
      categories: [],
    }
    setFilters(cleared)
    router.replace(`/buscar?q=${encodeURIComponent(query)}`, { scroll: false })
    setDrawerOpen(false)
  }

  const filterContentProps = {
    filters,
    setFilters,
    availableBrands,
    availableCategories,
    onApply: handleApply,
    onClear: handleClear,
  }

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">
        <FilterContent {...filterContentProps} />
      </aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-sm text-[var(--color-text-primary)]"
        >
          <i className="ti ti-adjustments-horizontal text-base" />
          Filtros
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-brand)] text-zinc-900 text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative bg-[var(--color-bg-primary)] rounded-t-2xl p-6 max-h-[85dvh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                aria-label="Fechar filtros"
              >
                <i className="ti ti-x text-lg" />
              </button>
              <FilterContent {...filterContentProps} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
