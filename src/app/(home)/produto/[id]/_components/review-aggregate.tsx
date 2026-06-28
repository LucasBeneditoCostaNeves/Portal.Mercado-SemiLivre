import Link from 'next/link'
import type { ReviewAggregate } from '@/domain/catalog/types'

type SearchParams = Record<string, string | string[] | undefined>

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} de 5 estrelas`}
    >
      {Array.from({ length: full }).map((_, i) => (
        <i
          key={`f${i}`}
          className="ti ti-star-filled text-[#EF9F27] text-xl"
          aria-hidden="true"
        />
      ))}
      {half && (
        <i
          className="ti ti-star-half text-[#EF9F27] text-xl"
          aria-hidden="true"
        />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <i
          key={`e${i}`}
          className="ti ti-star text-[#EF9F27] text-xl"
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function buildFilterUrl(
  searchParams: SearchParams,
  rating: number | null
): string {
  const params = new URLSearchParams()
  const sort =
    typeof searchParams.sort === 'string' ? searchParams.sort : undefined
  if (sort) params.set('sort', sort)
  if (rating !== null) params.set('rating', String(rating))
  const qs = params.toString()
  return qs ? `?${qs}` : '?'
}

type Props = {
  aggregate: ReviewAggregate
  searchParams: SearchParams
}

export default function ReviewAggregateBlock({
  aggregate,
  searchParams,
}: Props) {
  const { rating, reviewCount, distribution } = aggregate
  const activeRating =
    typeof searchParams.rating === 'string' ? Number(searchParams.rating) : null

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-5xl font-bold text-[#2D3277]">
          {rating.toFixed(1)}
        </span>
        <StarRating rating={rating} />
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {reviewCount.toLocaleString('pt-BR')} avaliações
        </span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = distribution[star] ?? 0
          const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0
          const isActive = activeRating === star
          const href = buildFilterUrl(searchParams, isActive ? null : star)

          return (
            <Link
              key={star}
              href={href}
              scroll={false}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label={`${star} estrelas: ${count} avaliações${isActive ? ' (ativo)' : ''}`}
            >
              <span className="text-xs text-[var(--color-text-secondary)] w-3 shrink-0 text-right">
                {star}
              </span>
              <i
                className="ti ti-star-filled text-[#EF9F27] text-xs shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 bg-[var(--color-bg-secondary)] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isActive ? 'bg-[#2D3277]' : 'bg-[#EF9F27]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-text-tertiary)] w-6 shrink-0">
                {count}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
