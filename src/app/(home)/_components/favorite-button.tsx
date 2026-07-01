'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/contexts/session-context'
import { addFavoriteAction, removeFavoriteAction } from '@/actions/favorites'

type Size = 'sm' | 'md' | 'lg'

type Props = {
  productId: string
  initialIsFavorite?: boolean
  initialFavoriteId?: string | null
  size?: Size
  className?: string
}

const sizeMap: Record<Size, { width: number; height: number }> = {
  sm: { width: 16, height: 15 },
  md: { width: 22, height: 21 },
  lg: { width: 28, height: 27 },
}

const HEART_PATH =
  'M140 20C73 20 20 74 20 140c0 135 136 170 228 303 88-132 229-173 229-303 0-66-54-120-120-120-48 0-90 28-109 69-19-41-60-69-108-69z'

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

  useEffect(() => {
    setIsFavorite(initialIsFavorite)
    setFavoriteId(initialFavoriteId)
  }, [initialIsFavorite, initialFavoriteId])

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
        await removeFavoriteAction(favoriteId)
        setFavoriteId(null)
        router.refresh()
      } catch (err) {
        console.error('[FavoriteButton] removeFavorite failed:', err)
        setIsFavorite(true)
      }
    } else {
      setIsFavorite(true)
      try {
        const { id } = await addFavoriteAction(productId)
        setFavoriteId(id)
        router.refresh()
      } catch (err) {
        console.error('[FavoriteButton] addFavorite failed:', err)
        setIsFavorite(false)
      }
    }

    setIsPending(false)
  }

  const { width, height } = sizeMap[size]

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`flex items-center justify-center disabled:opacity-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 497 470"
        width={width}
        height={height}
        aria-hidden="true"
        style={{ transition: 'transform 0.15s ease' }}
        className={isFavorite ? 'scale-110' : 'scale-100 hover:scale-105'}
      >
        <path
          d={HEART_PATH}
          stroke="red"
          strokeWidth="20"
          style={{ transition: 'fill 0.25s ease' }}
          fill={isFavorite ? 'red' : 'none'}
        />
      </svg>
    </button>
  )
}
