import type { FavoriteItem, FavoritesList, FavoriteStatus } from '@/types/favorites'
import { authenticatedFetch } from './cart.service'

export async function getFavorites(token: string, page = 1, limit = 20): Promise<FavoritesList> {
  return authenticatedFetch<FavoritesList>(
    `/favorites?page=${page}&limit=${limit}`,
    token,
    { cache: 'no-store' },
  )
}

export async function checkFavorite(token: string, productId: string): Promise<FavoriteStatus> {
  return authenticatedFetch<FavoriteStatus>(`/favorites/check/${productId}`, token, {
    cache: 'no-store',
  })
}

export async function addFavorite(
  token: string,
  productId: string,
): Promise<{ id: string; productId: string }> {
  return authenticatedFetch<{ id: string; productId: string }>('/favorites', token, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

export async function removeFavorite(token: string, favoriteId: string): Promise<void> {
  return authenticatedFetch<void>(`/favorites/${favoriteId}`, token, {
    method: 'DELETE',
  })
}

export async function getFavoritesMap(token: string): Promise<Record<string, string>> {
  const data = await getFavorites(token, 1, 100).catch(() => null)
  if (!data) return {}
  return Object.fromEntries(data.items.map((item) => [item.productId, item.favoriteId]))
}
