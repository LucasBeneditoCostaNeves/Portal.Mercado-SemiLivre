import type { ProductDetail } from '@/domain/catalog/types'
import FavoriteButton from '../../../_components/favorite-button'

type Props = Pick<
  ProductDetail,
  'title' | 'rating' | 'reviewCount' | 'seller' | 'badge' | 'description'
> & {
  productId: string
  initialIsFavorite: boolean
  initialFavoriteId: string | null
}

const badgeStyles = {
  OFERTA: 'bg-[#E6F1FB] text-[#378ADD]',
  NOVO: 'bg-emerald-950 text-emerald-300',
} as const

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
  )
}

export default function ProductInfo({
  title,
  rating,
  reviewCount,
  seller,
  badge,
  description,
  productId,
  initialIsFavorite,
  initialFavoriteId,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-medium text-[var(--color-text-primary)] mb-2 leading-snug">
            {title}
          </h1>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={rating} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {rating} ({reviewCount.toLocaleString('pt-BR')} avaliações)
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">
            Vendido por
          </p>
          <p className="text-sm text-[var(--color-text-primary)]">{seller}</p>
        </div>

        <FavoriteButton
          productId={productId}
          initialIsFavorite={initialIsFavorite}
          initialFavoriteId={initialFavoriteId}
          size="lg"
        />
      </div>

      {badge && (
        <div className="flex gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${badgeStyles[badge]}`}
          >
            {badge === 'OFERTA' ? 'Oferta' : 'Novo'}
          </span>
        </div>
      )}

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  )
}
