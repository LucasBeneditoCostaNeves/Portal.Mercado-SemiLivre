import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/domain/catalog/types'

function formatPrice(price: number) {
  const [intPart, decimalPart] = price.toFixed(2).split('.')
  const formatted = Number(intPart).toLocaleString('pt-BR')
  return { intPart: formatted, cents: decimalPart }
}

const badgeStyles: Record<NonNullable<Product['badge']>, string> = {
  OFERTA: 'bg-[var(--color-brand)] text-zinc-900',
  NOVO: 'bg-emerald-950 text-emerald-300',
}

export default function ProductCard({ product }: { product: Product }) {
  const { intPart, cents } = formatPrice(product.price)

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <article className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all group-hover:border-[var(--color-bg-elevated)] group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative w-full aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden mb-1">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {product.badge && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded w-fit ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}

        <p className="text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2">
          {product.title}
        </p>

        <p className="text-lg font-medium text-[var(--color-text-primary)] leading-none">
          R$ {intPart}
          <sup className="text-xs font-normal">,{cents}</sup>
        </p>

        <p className="text-xs text-emerald-400">{product.installments}</p>

        {product.freeShipping && (
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <i className="ti ti-truck text-xs" aria-hidden="true" />
            Frete grátis
          </p>
        )}

        <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-auto">
          <i className="ti ti-star text-xs" aria-hidden="true" />
          {product.rating} ({product.reviewCount.toLocaleString('pt-BR')})
        </p>
      </article>
    </Link>
  )
}
