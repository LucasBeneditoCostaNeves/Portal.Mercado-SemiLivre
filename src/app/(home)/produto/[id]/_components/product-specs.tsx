import type { ProductVariationDetail } from '@/domain/catalog/types'

type Props = {
  variations: ProductVariationDetail[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductSpecs({ variations }: Props) {
  return (
    <section>
      <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-3">
        Variações disponíveis
      </h2>
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        {variations.map((variation, index) => (
          <div
            key={variation.id}
            className={`flex items-center gap-3 px-3 py-2.5 ${
              index < variations.length - 1
                ? 'border-b border-[var(--color-border)]'
                : ''
            }`}
          >
            <span className="flex-1 text-xs font-medium text-[var(--color-text-secondary)]">
              {variation.title}
            </span>
            <span className="text-xs text-[var(--color-text-primary)]">
              {formatPrice(variation.price)}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] w-20 text-right">
              {variation.quantity > 0
                ? `${variation.quantity} em estoque`
                : 'Indisponível'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
