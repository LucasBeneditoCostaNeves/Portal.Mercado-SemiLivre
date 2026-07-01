import { apiClient } from '@/lib/http-client'
import { getSession } from '@/lib/session'
import type { UserSearchHistoryItem } from '@/types/history'

async function getAuthHeaders(): Promise<HeadersInit | null> {
  const token = await getSession()
  if (!token) return null
  return { Authorization: `Bearer ${token}` }
}

export async function recordSearch(term: string, token?: string | null): Promise<void> {
  const resolvedToken = token ?? (await getSession())
  if (!resolvedToken) return

  try {
    await apiClient('/history/search', {
      method: 'POST',
      body: JSON.stringify({ term }),
      headers: { Authorization: `Bearer ${resolvedToken}` },
    })
  } catch {
    // fire-and-forget
  }
}

export async function fetchSearchHistory(): Promise<UserSearchHistoryItem[]> {
  const headers = await getAuthHeaders()
  if (!headers) return []

  try {
    return await apiClient<UserSearchHistoryItem[]>('/history/searches', { headers })
  } catch {
    return []
  }
}
