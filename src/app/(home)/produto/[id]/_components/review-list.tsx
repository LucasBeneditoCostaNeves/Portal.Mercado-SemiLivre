'use client'

import { useState } from 'react'
import type { ReviewItem } from '@/domain/catalog/types'
import ReviewCard from './review-card'

type Props = {
  initialItems: ReviewItem[]
  initialHasMore: boolean
  total: number
  productId: string
  rating?: number
  sort?: string
}

export default function ReviewList({
  initialItems,
  initialHasMore,
  total,
  productId,
  rating,
  sort,
}: Props) {
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    setLoading(true)
    const nextPage = page + 1
    const qs = new URLSearchParams({ page: String(nextPage), limit: '10' })
    if (rating) qs.set('rating', String(rating))
    if (sort) qs.set('sort', sort)

    const base = process.env.NEXT_PUBLIC_API_URL
    const res = await fetch(
      `${base}/catalog/products/${productId}/reviews?${qs}`
    )
    const data = await res.json()
    setItems((prev) => [...prev, ...data.items])
    setHasMore(data.hasMore)
    setPage(nextPage)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--color-text-tertiary)]">
        {total.toLocaleString('pt-BR')} comentários
      </p>

      <div className="flex flex-col gap-4">
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="text-sm text-[#2D3277] hover:underline disabled:opacity-50 self-start"
        >
          {loading ? 'Carregando...' : 'Ver mais avaliações'}
        </button>
      )}
    </div>
  )
}
