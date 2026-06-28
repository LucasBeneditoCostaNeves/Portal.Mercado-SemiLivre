import { Suspense } from 'react'
import { getProductReviews } from '@/services/catalog.service'
import ReviewAggregateBlock from './review-aggregate'
import ReviewPhotosGallery from './review-photos-gallery'
import ReviewFilters from './review-filters'
import ReviewList from './review-list'

type SearchParams = Record<string, string | string[] | undefined>

function getString(v: string | string[] | undefined): string | undefined {
  return typeof v === 'string' ? v : undefined
}

type Props = {
  productId: string
  searchParams: SearchParams
}

export default async function ProductReviewsSection({
  productId,
  searchParams,
}: Props) {
  const ratingStr = getString(searchParams.rating)
  const sort = (getString(searchParams.sort) ?? 'recent') as 'recent' | 'top'

  const data = await getProductReviews(productId, {
    page: 1,
    limit: 10,
    rating: ratingStr ? Number(ratingStr) : undefined,
    sort,
  })

  if (data.aggregate.reviewCount === 0) return null

  return (
    <section className="flex flex-col gap-6 pt-6 border-t border-[var(--color-border)]">
      <h2 className="text-lg font-medium text-[var(--color-text-primary)]">
        Opiniões do produto
      </h2>

      <ReviewAggregateBlock
        aggregate={data.aggregate}
        searchParams={searchParams}
      />

      {data.aggregate.photos.length > 0 && (
        <ReviewPhotosGallery photos={data.aggregate.photos} />
      )}

      {data.aggregate.aiSummary && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#2D3277]">
            <i className="ti ti-sparkles text-sm" aria-hidden="true" />
            <span>Resumo de opiniões gerado por IA</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {data.aggregate.aiSummary}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Suspense fallback={null}>
          <ReviewFilters />
        </Suspense>
        <ReviewList
          initialItems={data.items}
          initialHasMore={data.hasMore}
          total={data.total}
          productId={productId}
          rating={ratingStr ? Number(ratingStr) : undefined}
          sort={sort}
        />
      </div>
    </section>
  )
}
