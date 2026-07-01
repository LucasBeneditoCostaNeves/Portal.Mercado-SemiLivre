'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import type { ProductDetail } from '@/domain/catalog/types'
import { addToCart } from '@/app/(home)/carrinho/actions'

type Props = Pick<ProductDetail, 'price' | 'installments' | 'freeShipping'> & {
  variationId: string
  productId: string
}

type DeliveryOption = 'envio' | 'retirar'

function formatPrice(price: number) {
  const [intPart, decimalPart] = price.toFixed(2).split('.')
  return {
    intPart: Number(intPart).toLocaleString('pt-BR'),
    cents: decimalPart,
  }
}

export default function PriceBox({
  price,
  installments,
  freeShipping,
  variationId,
  productId,
}: Props) {
  const [delivery, setDelivery] = useState<DeliveryOption>('envio')
  const [isPending, startTransition] = useTransition()

  function handleAddToCart() {
    startTransition(async () => {
      const result = await addToCart(variationId, 1)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto adicionado ao carrinho! 🛒')
      }
    })
  }
  const { intPart, cents } = formatPrice(price)

  return (
    <div className="border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4 bg-[var(--color-surface-card)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-3xl font-medium text-[var(--color-text-primary)] leading-none">
            R$ {intPart}
            <sup className="text-base font-normal">,{cents}</sup>
          </p>
          <p className="text-xs text-emerald-400 mt-1">{installments}</p>
        </div>
      </div>

      {freeShipping && (
        <div className="flex items-center gap-2 bg-[#EAF3DE] text-[#3B6D11] rounded-md px-3 py-2 text-xs">
          <i className="ti ti-truck text-sm" aria-hidden="true" />
          <span>Frete grátis</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className="py-3 text-sm font-medium rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] transition-colors disabled:opacity-60"
        >
          {isPending ? 'Adicionando...' : 'Adicionar ao carrinho'}
        </button>
        <button
          type="button"
          className="py-3 text-sm font-medium rounded-lg bg-[#2D3277] text-[#FFE600] hover:opacity-90 transition-opacity"
        >
          Comprar agora
        </button>
      </div>

      {/* <div className="pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
        <label className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer">
          <input
            type="radio"
            name="delivery"
            value="envio"
            checked={delivery === 'envio'}
            onChange={() => setDelivery('envio')}
            className="accent-[#2D3277]"
          />
          <i
            className="ti ti-truck text-sm text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          />
          Receber em casa
        </label>
        <label className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer">
          <input
            type="radio"
            name="delivery"
            value="retirar"
            checked={delivery === 'retirar'}
            onChange={() => setDelivery('retirar')}
            className="accent-[#2D3277]"
          />
          <i
            className="ti ti-building-store text-sm text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          />
          Retirar na loja
        </label>
      </div> */}
    </div>
  )
}
