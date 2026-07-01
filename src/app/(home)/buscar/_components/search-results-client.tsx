'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/domain/catalog/types'
import type { SearchParams } from '@/types/search'
import ProductCard from '@/app/(home)/_components/product-card'
import ProductGridSkeleton from './product-grid-skeleton'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const PAGE_SIZE = 20

type Props = {
  initialItems: Product[]
  initialHasMore: boolean
  query: string
  filters: SearchParams
  favoritesMap?: Record<string, string>
}

function buildQueryString(query: string, params: SearchParams): string {
  const qs = new URLSearchParams()
  qs.set('q', query)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  if (params.sort) qs.set('sort', params.sort)
  if (params.order) qs.set('order', params.order)
  if (params.freeShipping) qs.set('freeShipping', 'true')
  if (params.minPrice !== undefined) qs.set('minPrice', String(params.minPrice))
  if (params.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice))
  if (params.minRating !== undefined)
    qs.set('minRating', String(params.minRating))
  if (params.brand?.length) qs.set('brand', params.brand.join(','))
  if (params.category?.length) qs.set('category', params.category.join(','))
  return qs.toString()
}

export default function SearchResultsClient({
  initialItems,
  initialHasMore,
  query,
  filters,
  favoritesMap = {},
}: Props) {
  const [items, setItems] = useState<Product[]>(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const offsetRef = useRef(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current) return
        loadingRef.current = true
        setLoading(true)

        try {
          const qs = buildQueryString(query, {
            ...filters,
            limit: PAGE_SIZE,
            offset: offsetRef.current,
          })
          const res = await fetch(`${BASE_URL}/catalog/products?${qs}`)
          if (!res.ok) return
          const data = await res.json()
          setItems((prev) => [...prev, ...data.items])
          setHasMore(data.hasMore)
          offsetRef.current += PAGE_SIZE
        } finally {
          loadingRef.current = false
          setLoading(false)
        }
      },
      { rootMargin: '300px' }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, query, filters])

  return (
    <div className="flex flex-col gap-6">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        aria-label="Resultados da pesquisa"
      >
        {items.map((product) => (
          <ProductCard
                key={product.id}
                product={product}
                sourcePage="search"
                initialIsFavorite={product.id in favoritesMap}
                initialFavoriteId={favoritesMap[product.id] ?? null}
              />
        ))}
      </div>

      {loading && <ProductGridSkeleton count={4} />}

      {hasMore && !loading && (
        <div ref={sentinelRef} className="h-4" aria-hidden="true" />
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-sm text-[var(--color-text-secondary)] py-4">
          Você viu todos os resultados
        </p>
      )}
    </div>
  )
}
