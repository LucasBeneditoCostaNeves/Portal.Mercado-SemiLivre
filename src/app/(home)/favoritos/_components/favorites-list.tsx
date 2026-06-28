'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FavoriteItem } from '@/types/favorites'
import { removeFavorite } from '@/services/favorites.service'

type Props = {
  items: FavoriteItem[]
  token: string
}

function formatPrice(price: number) {
  const [intPart, decimalPart] = price.toFixed(2).split('.')
  return { intPart: Number(intPart).toLocaleString('pt-BR'), cents: decimalPart }
}

export default function FavoritesList({ items, token }: Props) {
  const router = useRouter()
  const [localItems, setLocalItems] = useState(items)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleRemove(favoriteId: string) {
    setRemovingId(favoriteId)
    setLocalItems((prev) => prev.filter((item) => item.favoriteId !== favoriteId))
    try {
      await removeFavorite(token, favoriteId)
      router.refresh()
    } catch {
      setLocalItems(items)
    } finally {
      setRemovingId(null)
    }
  }

  if (localItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-xl border border-[var(--color-border)]">
        <i className="ti ti-heart-off text-5xl text-[var(--color-text-tertiary)]" aria-hidden="true" />
        <p className="text-[var(--color-text-secondary)] text-sm">
          Você ainda não tem produtos favoritos.
        </p>
        <Link href="/" className="text-sm font-medium text-[#2D3277] hover:underline">
          Explorar produtos
        </Link>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      aria-label="Produtos favoritos"
    >
      {localItems.map((item) => {
        const priceFormatted = item.price ? formatPrice(item.price) : null

        return (
          <article
            key={item.favoriteId}
            className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col gap-2"
          >
            <Link href={`/produto/${item.productId}`} className="block">
              <div className="relative w-full aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden mb-1">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <p className="text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2">
                {item.title}
              </p>
              {priceFormatted && (
                <p className="text-lg font-medium text-[var(--color-text-primary)] leading-none">
                  R$ {priceFormatted.intPart}
                  <sup className="text-xs font-normal">,{priceFormatted.cents}</sup>
                </p>
              )}
            </Link>

            <button
              type="button"
              onClick={() => handleRemove(item.favoriteId)}
              disabled={removingId === item.favoriteId}
              className="mt-auto flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-red-500 transition-colors disabled:opacity-50 py-1.5"
            >
              <i className="ti ti-trash text-sm" aria-hidden="true" />
              Remover dos favoritos
            </button>
          </article>
        )
      })}
    </div>
  )
}
