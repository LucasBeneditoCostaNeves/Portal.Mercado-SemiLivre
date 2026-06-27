import type { ProductDetail } from "@/domain/catalog/types";

type Props = Pick<
  ProductDetail,
  "title" | "rating" | "reviewCount" | "seller" | "badge" | "description"
>;

const badgeStyles = {
  OFERTA: "bg-[#E6F1FB] text-[#378ADD]",
  NOVO: "bg-emerald-950 text-emerald-300",
} as const;

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: full }).map((_, i) => (
        <i key={`f${i}`} className="ti ti-star-filled text-[#EF9F27] text-sm" aria-hidden="true" />
      ))}
      {half && <i className="ti ti-star-half text-[#EF9F27] text-sm" aria-hidden="true" />}
      {Array.from({ length: empty }).map((_, i) => (
        <i key={`e${i}`} className="ti ti-star text-[#EF9F27] text-sm" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function ProductInfo({ title, rating, reviewCount, seller, badge, description }: Props) {
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
              {rating} ({reviewCount.toLocaleString("pt-BR")} avaliações)
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-tertiary)]">Vendido por</p>
          <p className="text-sm text-[var(--color-text-primary)]">{seller}</p>
        </div>

        <button
          className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)] shrink-0"
          aria-label="Adicionar aos favoritos"
        >
          <i className="ti ti-heart text-base" aria-hidden="true" />
          <span className="hidden sm:inline">Favoritar</span>
        </button>
      </div>

      {badge && (
        <div className="flex gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${badgeStyles[badge]}`}>
            {badge === "OFERTA" ? "Oferta" : "Novo"}
          </span>
        </div>
      )}

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}
