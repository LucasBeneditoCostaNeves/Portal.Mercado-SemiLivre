'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/session-context'
import { addFavorite, removeFavorite } from '@/services/favorites.service'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  productId: string
  initialIsFavorite?: boolean
  initialFavoriteId?: string | null
  size?: Size
  className?: string
}

const sizeMap: Record<Size, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function FavoriteButton({
  productId,
  initialIsFavorite = false,
  initialFavoriteId = null,
  size = 'md',
  className = '',
}: Props) {
  const token = useSession()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [favoriteId, setFavoriteId] = useState(initialFavoriteId)
  const [isPending, setIsPending] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      router.push('/login')
      return
    }

    if (isPending) return
    setIsPending(true)

    if (isFavorite && favoriteId) {
      setIsFavorite(false)
      try {
        await removeFavorite(token, favoriteId)
        setFavoriteId(null)
        router.refresh()
      } catch (err) {
        console.error('[FavoriteButton] removeFavorite failed:', err)
        setIsFavorite(true)
      }
    } else {
      setIsFavorite(true)
      try {
        const { id } = await addFavorite(token, productId)
        setFavoriteId(id)
        router.refresh()
      } catch (err) {
        console.error('[FavoriteButton] addFavorite failed:', err)
        setIsFavorite(false)
      }
    }

    setIsPending(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`flex items-center justify-center transition-colors disabled:opacity-50 ${className}`}
    >
      <i
        className={`${sizeMap[size]} ${
          isFavorite
            ? 'ti ti-heart-filled text-red-500'
            : 'ti ti-heart text-[var(--color-text-tertiary)] hover:text-red-400'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}
