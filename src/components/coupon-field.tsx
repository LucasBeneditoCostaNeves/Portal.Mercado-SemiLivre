'use client'

import { useTransition, useState } from 'react'
import type { AppliedCoupon } from '@/types/coupon'
import { applyCouponAction, removeCouponAction } from '@/app/(home)/carrinho/actions'

type Props = {
  cartItemIds: string[]
  appliedCoupon: AppliedCoupon | null
  onApply: (coupon: AppliedCoupon) => void
  onRemove: () => void
}

export function CouponField({ cartItemIds, appliedCoupon, onApply, onRemove }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleApply() {
    if (!code.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await applyCouponAction(code.trim().toUpperCase(), cartItemIds)
      if ('error' in result) {
        setError(result.error)
      } else {
        onApply({ code: result.coupon.code, discountAmount: result.coupon.discountAmount })
        setCode('')
      }
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCouponAction()
      onRemove()
    })
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-sm">
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
          <i className="ti ti-tag text-sm" aria-hidden="true" />
          {appliedCoupon.code}
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="text-xs text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors"
        >
          Remover
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold tracking-wide text-[var(--color-text-tertiary)] uppercase">
        Cupom de desconto
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="Código do cupom"
          disabled={isPending}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#2D3277] disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#2D3277] text-[#2D3277] hover:bg-[#2D3277] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {isPending ? (
            <i className="ti ti-loader-2 animate-spin text-base" aria-hidden="true" />
          ) : (
            'Aplicar'
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
