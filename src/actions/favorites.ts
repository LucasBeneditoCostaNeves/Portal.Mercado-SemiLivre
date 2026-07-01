'use server'

import { apiClient } from '@/lib/http-client'
import { getSession } from '@/lib/session'

export async function addFavoriteAction(
  productId: string,
): Promise<{ id: string; productId: string }> {
  const token = await getSession()
  if (!token) throw new Error('Unauthenticated')

  return apiClient<{ id: string; productId: string }>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ productId }),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function removeFavoriteAction(favoriteId: string): Promise<void> {
  const token = await getSession()
  if (!token) throw new Error('Unauthenticated')

  console.log('[removeFavoriteAction] favoriteId:', favoriteId)

  return apiClient<void>(`/favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
