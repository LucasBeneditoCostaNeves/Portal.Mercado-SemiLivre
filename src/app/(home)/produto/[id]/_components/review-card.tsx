import Image from 'next/image'
import type { ReviewItem } from '@/domain/catalog/types'

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      <div
        className="flex items-center gap-0.5"
        aria-label={`${rating} de 5 estrelas`}
      >
        {Array.from({ length: full }).map((_, i) => (
          <i
            key={`f${i}`}
            className="ti ti-star-filled text-[#EF9F27] text-sm"
            aria-hidden="true"
          />
        ))}
        {half && (
          <i
            className="ti ti-star-half text-[#EF9F27] text-sm"
            aria-hidden="true"
          />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <i
            key={`e${i}`}
            className="ti ti-star text-[#EF9F27] text-sm"
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-xs font-medium text-[var(--color-text-primary)]">
        {rating % 1 === 0 ? rating : rating.toFixed(1)}
      </span>
    </div>
  )
}

function formatRelativeDate(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diffMs / 86400000)
  if (days < 1) return 'Hoje'
  if (days === 1) return 'Há 1 dia'
  if (days < 30) return `Há ${days} dias`
  const months = Math.floor(days / 30)
  if (months === 1) return 'Há 1 mês'
  if (months < 12) return `Há ${months} meses`
  const years = Math.floor(months / 12)
  return years === 1 ? 'Há 1 ano' : `Há ${years} anos`
}

export default function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.rating} />
        <span className="text-xs text-[var(--color-text-secondary)]">
          {review.country ? `${review.country} · ` : ''}
          {formatRelativeDate(review.createdAt)}
        </span>
      </div>

      {review.text && (
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          {review.text}
        </p>
      )}

      {review.photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.photos.map((photo, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded-md overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shrink-0"
            >
              <Image
                src={photo}
                alt={`Foto da avaliação ${i + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
