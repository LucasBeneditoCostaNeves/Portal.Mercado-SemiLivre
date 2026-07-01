'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CartItem } from '@/types/cart'
import type { AppliedCoupon } from '@/types/coupon'
import { CouponField } from '@/components/coupon-field'
import { useCartSelection } from './cart-selection-context'

function formatPrice(value: number) {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type Props = {
  items: CartItem[]
}

export function CartSummary({ items }: Props) {
  const router = useRouter()
  const { selectedIds } = useCartSelection()
  const [cep, setCep] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const selectedItems = items.filter((item) => selectedIds.has(item.id))
  const selectedIds_arr = selectedItems.map((item) => item.id)

  function handleContinue() {
    if (selectedIds_arr.length === 0) return
    router.push(`/checkout/endereco?itens=${selectedIds_arr.join(',')}`)
  }

  const totalQty = selectedItems.reduce((acc, item) => acc + item.quantity, 0)

  const subtotal = selectedItems.reduce((acc, item) => {
    const discount = Number(item.discountPercentage)
    const unit = Number(item.price)
    const discountedUnit = discount > 0 ? unit * (1 - discount / 100) : unit
    return acc + discountedUnit * item.quantity
  }, 0)

  const allFreeShipping =
    selectedItems.length > 0 && selectedItems.every((item) => item.freeShipping)

  const total = subtotal - (appliedCoupon?.discountAmount ?? 0)

  return (
    <div className="flex flex-col gap-3 sticky top-4">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          Resumo da compra
        </h2>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">
              Produto ({totalQty})
            </span>
            <span className="text-[var(--color-text-primary)] font-medium">
              R$ {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Frete</span>
            <span
              className={
                allFreeShipping
                  ? 'text-emerald-500 font-medium'
                  : 'text-[var(--color-text-secondary)]'
              }
            >
              {allFreeShipping ? 'Grátis' : 'A calcular'}
            </span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">
                Cupom ({appliedCoupon.code})
              </span>
              <span className="text-emerald-600 font-medium">
                − R$ {formatPrice(appliedCoupon.discountAmount)}
              </span>
            </div>
          )}
        </div>

        <CouponField
          cartItemIds={selectedIds_arr}
          appliedCoupon={appliedCoupon}
          onApply={setAppliedCoupon}
          onRemove={() => setAppliedCoupon(null)}
        />

        <div className="border-t border-[var(--color-border)] pt-4 flex justify-between items-center">
          <span className="text-base font-bold text-[var(--color-text-primary)]">Total</span>
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            R$ {formatPrice(total)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold tracking-wide text-[var(--color-text-tertiary)] uppercase">
            Calcular frete
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#2D3277]"
            />
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2D3277] text-white hover:opacity-90 transition-opacity shrink-0"
            >
              Calcular
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className="w-full py-3.5 rounded-xl bg-[#FFE600] text-[#333] font-bold text-sm hover:bg-[#f0d800] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continuar
          <i className="ti ti-chevron-right text-base" aria-hidden="true" />
        </button>

        <p className="text-[11px] text-center text-[var(--color-text-tertiary)]">
          Compra 100% segura · Frete grátis acima de R$ 79
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex flex-col gap-3">
        <p className="text-[10px] font-bold tracking-widest text-[var(--color-text-tertiary)] uppercase">
          Sua compra protegida
        </p>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <i className="ti ti-lock text-sm text-[var(--color-text-tertiary)]" aria-hidden="true" />
            Pagamento 100% seguro
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <i className="ti ti-refresh text-sm text-[var(--color-text-tertiary)]" aria-hidden="true" />
            Devolução grátis em 30 dias
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <i className="ti ti-package text-sm text-[var(--color-text-tertiary)]" aria-hidden="true" />
            Entrega rastreada garantida
          </div>
        </div>
      </div>
    </div>
  )
}
