'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ProductCard from '@/app/(home)/_components/product-card'
import type { Product } from '@/domain/catalog/types'
import type { CategoryPageSearchParams } from '@/types/category'
import CategoryFiltersPanel from './category-filters-panel'
import EmptyCategoryState from './empty-category-state'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const PAGE_SIZE = 20

type Props = {
  initialItems: Product[]
  total: number
  initialHasMore: boolean
  categoryLabel: string
  searchParams: CategoryPageSearchParams
  favoritesMap?: Record<string, string>
}

function buildProductsUrl(
  categoryLabel: string,
  params: CategoryPageSearchParams,
  offset: number
): string {
  const qs = new URLSearchParams({
    category: categoryLabel,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  })
  if (params.sort) qs.set('sort', params.sort)
  if (params.order) qs.set('order', params.order)
  if (params.freeShipping === 'true') qs.set('freeShipping', 'true')
  if (params.minPrice) qs.set('minPrice', params.minPrice)
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice)
  if (params.minRating) qs.set('minRating', params.minRating)
  if (params.brand) qs.set('brand', params.brand)
  return `${BASE_URL}/catalog/products?${qs}`
}

export default function CategoryResultsClient({
  initialItems,
  total,
  initialHasMore,
  categoryLabel,
  searchParams,
  favoritesMap = {},
}: Props) {
  const [items, setItems] = useState<Product[]>(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [offset, setOffset] = useState(initialItems.length)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setItems(initialItems)
    setHasMore(initialHasMore)
    setOffset(initialItems.length)
  }, [initialItems, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const url = buildProductsUrl(categoryLabel, searchParams, offset)
      const res = await fetch(url)
      const data = (await res.json()) as { items: Product[]; hasMore: boolean }
      setItems((prev) => [...prev, ...data.items])
      setHasMore(data.hasMore)
      setOffset((prev) => prev + data.items.length)
    } finally {
      setIsLoadingMore(false)
    }
  }, [categoryLabel, searchParams, offset, isLoadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  const brands = useMemo(
    () =>
      [...new Set(items.map((i) => i.brand).filter(Boolean) as string[])].sort(),
    [items]
  )

  const hasFilters = Boolean(
    searchParams.sort ||
      searchParams.freeShipping ||
      searchParams.minPrice ||
      searchParams.maxPrice ||
      searchParams.minRating ||
      searchParams.brand
  )

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">
      <CategoryFiltersPanel brands={brands} />

      <div className="flex-1 min-w-0">
        {items.length === 0 ? (
          <EmptyCategoryState label={categoryLabel} hasFilters={hasFilters} />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {items.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    sourcePage="category"
                    initialIsFavorite={product.id in favoritesMap}
                    initialFavoriteId={favoritesMap[product.id] ?? null}
                  />
              ))}
              {isLoadingMore &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl aspect-square animate-pulse"
                  />
                ))}
            </div>

            {hasMore && <div ref={sentinelRef} className="h-4" />}

            {!hasMore && (
              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-8">
                Você viu todos os produtos
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
