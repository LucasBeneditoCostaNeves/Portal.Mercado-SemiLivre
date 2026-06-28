'use client'

import Image from 'next/image'
import { useState, useOptimistic, useTransition } from 'react'
import type { CartItem } from '@/types/cart'
import { removeCartItem, updateCartItemQuantity } from '../actions'
import { useCartSelection } from './cart-selection-context'

function formatPrice(price: number) {
  return Number(price).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type Props = {
  item: CartItem
}

export function CartItemCard({ item }: Props) {
  const [optimisticQty, setOptimisticQty] = useOptimistic(item.quantity)
  const [isPending, startTransition] = useTransition()
  const { isSelected, toggleItem } = useCartSelection()
  const [coupon, setCoupon] = useState('')

  const discount = Number(item.discountPercentage)
  const unitPrice = Number(item.price)
  const discountedUnitPrice = discount > 0 ? unitPrice * (1 - discount / 100) : unitPrice
  const totalPrice = discountedUnitPrice * optimisticQty
  const originalTotal = unitPrice * optimisticQty

  function handleIncrement() {
    const newQty = optimisticQty + 1
    startTransition(async () => {
      setOptimisticQty(newQty)
      await updateCartItemQuantity(item.id, newQty)
    })
  }

  function handleDecrement() {
    if (optimisticQty <= 1) return
    const newQty = optimisticQty - 1
    startTransition(async () => {
      setOptimisticQty(newQty)
      await updateCartItemQuantity(item.id, newQty)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCartItem(item.id)
    })
  }

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3 items-start">
        <input
          type="checkbox"
          checked={isSelected(item.id)}
          onChange={() => toggleItem(item.id)}
          className="mt-1 w-4 h-4 accent-[#2D3277] cursor-pointer shrink-0"
          aria-label={`Selecionar ${item.productTitle}`}
        />

        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
          <Image
            src={item.productThumbnail}
            alt={item.productTitle}
            fill
            className="object-contain"
            sizes="96px"
          />
          {discount > 0 && (
            <span className="absolute top-1 left-1 bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {Math.round(discount)}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2">
            {item.productTitle}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">{item.variationTitle}</p>

          <div className="mt-1 flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-[#2D63C8]">
                R$ {formatPrice(totalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-[var(--color-text-tertiary)] line-through">
                  R$ {formatPrice(originalTotal)}
                </span>
              )}
            </div>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              R$ {formatPrice(discountedUnitPrice)} /un
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 border border-[var(--color-border)] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isPending || optimisticQty <= 1}
            className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[var(--color-bg-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-8 text-center text-sm text-[var(--color-text-primary)] select-none">
            {optimisticQty}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isPending}
            className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[var(--color-bg-secondary)] disabled:opacity-40 transition-colors"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-3 ml-7 flex items-center gap-2">
        <p className="text-[10px] font-semibold tracking-wide text-[var(--color-text-tertiary)] uppercase shrink-0">
          Cupom de desconto
        </p>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <i className="ti ti-tag absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-tertiary)]" aria-hidden="true" />
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Tem um cupom? Digite aqui"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[#2D3277]"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#FFE600] text-[#333] hover:bg-[#f0d800] transition-colors shrink-0"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="p-2 text-[var(--color-text-tertiary)] hover:text-red-500 disabled:opacity-40 transition-colors"
            aria-label="Remover item"
          >
            <i className="ti ti-trash text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
