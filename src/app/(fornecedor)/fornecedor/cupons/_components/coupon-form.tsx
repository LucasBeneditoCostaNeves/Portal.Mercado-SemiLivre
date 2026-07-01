'use client'

import { useState } from 'react'
import type { Coupon, CouponScope, CouponDiscountType } from '@/types/coupon'

type SellerCouponScope = Exclude<CouponScope, 'global'>

type Props = {
  initialData?: Partial<Coupon>
  allowGlobalScope?: boolean
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
}

export function CouponForm({
  initialData,
  allowGlobalScope = false,
  action,
  submitLabel = 'Salvar Cupom',
}: Props) {
  const [scope, setScope] = useState<CouponScope>(
    initialData?.scope ?? 'seller',
  )
  const [discountType, setDiscountType] = useState<CouponDiscountType>(
    initialData?.discountType ?? 'percentage',
  )

  const scopeOptions: Array<{ value: CouponScope; label: string }> = [
    ...(allowGlobalScope
      ? [{ value: 'global' as const, label: 'Global (todos os produtos)' }]
      : []),
    { value: 'seller', label: 'Todos os meus produtos' },
    { value: 'product', label: 'Produto específico' },
  ]

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm text-[var(--color-text-secondary)]">
            Código do cupom
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            defaultValue={initialData?.code}
            placeholder="EX: PROMO10"
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm uppercase font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="scope" className="text-sm text-[var(--color-text-secondary)]">
            Escopo
          </label>
          <select
            id="scope"
            name="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value as CouponScope)}
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          >
            {scopeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {scope === 'product' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="productId" className="text-sm text-[var(--color-text-secondary)]">
            ID do produto
          </label>
          <input
            id="productId"
            name="productId"
            type="text"
            required
            defaultValue={initialData?.productId}
            placeholder="ID do produto"
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="discountType" className="text-sm text-[var(--color-text-secondary)]">
            Tipo de desconto
          </label>
          <select
            id="discountType"
            name="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as CouponDiscountType)}
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          >
            <option value="percentage">Percentual (%)</option>
            <option value="fixed">Valor fixo (R$)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="discountValue" className="text-sm text-[var(--color-text-secondary)]">
            {discountType === 'percentage' ? 'Desconto (%)' : 'Desconto (R$)'}
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            required
            min={0.01}
            step={discountType === 'percentage' ? 1 : 0.01}
            max={discountType === 'percentage' ? 100 : undefined}
            defaultValue={initialData?.discountValue}
            placeholder={discountType === 'percentage' ? '10' : '50.00'}
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="minOrderValue" className="text-sm text-[var(--color-text-secondary)]">
            Valor mínimo do pedido (opcional)
          </label>
          <input
            id="minOrderValue"
            name="minOrderValue"
            type="number"
            min={0}
            step={0.01}
            defaultValue={initialData?.minOrderValue}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>

        {discountType === 'percentage' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="maxDiscountValue" className="text-sm text-[var(--color-text-secondary)]">
              Teto de desconto em R$ (opcional)
            </label>
            <input
              id="maxDiscountValue"
              name="maxDiscountValue"
              type="number"
              min={0}
              step={0.01}
              defaultValue={initialData?.maxDiscountValue}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="usageLimit" className="text-sm text-[var(--color-text-secondary)]">
            Limite de usos total (opcional)
          </label>
          <input
            id="usageLimit"
            name="usageLimit"
            type="number"
            min={1}
            step={1}
            defaultValue={initialData?.usageLimit}
            placeholder="Ilimitado"
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="usageLimitPerUser" className="text-sm text-[var(--color-text-secondary)]">
            Limite por usuário (opcional)
          </label>
          <input
            id="usageLimitPerUser"
            name="usageLimitPerUser"
            type="number"
            min={1}
            step={1}
            defaultValue={initialData?.usageLimitPerUser}
            placeholder="Ilimitado"
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startsAt" className="text-sm text-[var(--color-text-secondary)]">
            Início da validade
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={initialData?.startsAt?.slice(0, 16)}
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiresAt" className="text-sm text-[var(--color-text-secondary)]">
            Fim da validade (opcional)
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="datetime-local"
            defaultValue={initialData?.expiresAt?.slice(0, 16)}
            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D3277] transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-[#2D3277] text-white font-bold text-sm hover:opacity-90 transition-opacity"
      >
        {submitLabel}
      </button>
    </form>
  )
}
