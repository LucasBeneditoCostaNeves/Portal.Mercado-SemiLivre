import type { CartItem } from '@/types/cart'
import { CartItemCard } from './cart-item-card'

type Props = {
  sellerName: string
  items: CartItem[]
}

export function SellerGroup({ sellerName, items }: Props) {
  const initial = sellerName.charAt(0).toUpperCase()

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)]">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2D3277] text-white text-sm font-semibold flex items-center justify-center shrink-0">
            {initial}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {sellerName}
          </span>
          <span className="text-[#2D9CDB]">
            <i className="ti ti-circle-check-filled text-base" aria-hidden="true" />
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)]">Vendedor verificado</span>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {items.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
