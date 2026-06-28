'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  brands: string[]
}

const SORT_OPTIONS = [
  { label: 'Relevância', sort: '', order: '' },
  { label: 'Menor preço', sort: 'price', order: 'asc' },
  { label: 'Maior preço', sort: 'price', order: 'desc' },
  { label: 'Melhor avaliação', sort: 'rating', order: 'desc' },
  { label: 'Mais vendidos', sort: 'sales', order: 'desc' },
]

export default function CategoryFiltersPanel({ brands }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [sort, setSort] = useState(searchParams.get('sort') ?? '')
  const [order, setOrder] = useState(searchParams.get('order') ?? '')
  const [freeShipping, setFreeShipping] = useState(
    searchParams.get('freeShipping') === 'true'
  )
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [minRating, setMinRating] = useState(
    Number(searchParams.get('minRating') ?? 0)
  )
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(
    new Set(
      searchParams
        .get('brand')
        ?.split(',')
        .filter(Boolean) ?? []
    )
  )

  useEffect(() => {
    setSort(searchParams.get('sort') ?? '')
    setOrder(searchParams.get('order') ?? '')
    setFreeShipping(searchParams.get('freeShipping') === 'true')
    setMinPrice(searchParams.get('minPrice') ?? '')
    setMaxPrice(searchParams.get('maxPrice') ?? '')
    setMinRating(Number(searchParams.get('minRating') ?? 0))
    setSelectedBrands(
      new Set(
        searchParams
          .get('brand')
          ?.split(',')
          .filter(Boolean) ?? []
      )
    )
  }, [searchParams])

  const activeFilterCount = [
    freeShipping,
    minPrice !== '',
    maxPrice !== '',
    minRating > 0,
    selectedBrands.size > 0,
  ].filter(Boolean).length

  function applyFilters() {
    const params = new URLSearchParams()
    if (sort) params.set('sort', sort)
    if (order) params.set('order', order)
    if (freeShipping) params.set('freeShipping', 'true')
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minRating > 0) params.set('minRating', String(minRating))
    if (selectedBrands.size > 0)
      params.set('brand', [...selectedBrands].join(','))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    setIsDrawerOpen(false)
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false })
    setIsDrawerOpen(false)
  }

  function toggleBrand(brand: string, checked: boolean) {
    const next = new Set(selectedBrands)
    if (checked) next.add(brand)
    else next.delete(brand)
    setSelectedBrands(next)
  }

  const panelContent = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Ordenar por
        </h3>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="sort"
                checked={sort === opt.sort && order === opt.order}
                onChange={() => {
                  setSort(opt.sort)
                  setOrder(opt.order)
                }}
                className="accent-[var(--color-brand)]"
              />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={freeShipping}
          onChange={(e) => setFreeShipping(e.target.checked)}
          className="accent-[var(--color-brand)] w-4 h-4"
        />
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          Frete grátis
        </span>
      </label>

      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Faixa de preço
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-8 px-2 text-sm border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-bg-elevated)]"
          />
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-8 px-2 text-sm border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-bg-elevated)]"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Avaliação mínima
        </h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setMinRating(minRating === star ? 0 : star)}
              aria-label={`${star} estrela${star > 1 ? 's' : ''} ou mais`}
              className="text-xl leading-none"
            >
              <i
                className={`ti ${star <= minRating ? 'ti-star-filled' : 'ti-star'} text-[var(--color-brand)]`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Marca
          </h3>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.has(brand)}
                  onChange={(e) => toggleBrand(brand, e.target.checked)}
                  className="accent-[var(--color-brand)] w-4 h-4"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={applyFilters}
          className="w-full h-9 bg-[var(--color-brand)] text-[var(--color-brand-dark)] text-sm font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="w-full h-9 border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm rounded-lg hover:border-[var(--color-bg-elevated)] transition-colors"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-56 shrink-0">{panelContent}</aside>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Abrir filtros"
          className="relative flex items-center gap-2 h-9 px-4 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] hover:border-[var(--color-bg-elevated)] transition-colors"
        >
          <i
            className="ti ti-adjustments-horizontal text-base"
            aria-hidden="true"
          />
          Filtros
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-brand-dark)] text-[var(--color-brand)] text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-primary)] rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto transition-transform duration-300 ${
            isDrawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          aria-modal={isDrawerOpen}
          aria-label="Filtros"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              Filtros
            </h2>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Fechar filtros"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <i className="ti ti-x text-lg" aria-hidden="true" />
            </button>
          </div>
          {panelContent}
        </aside>
      </div>
    </>
  )
}
