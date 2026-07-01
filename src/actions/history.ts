'use server'

import { apiClient } from '@/lib/http-client'
import { getSession } from '@/lib/session'
import type { SourcePage } from '@/types/history'

export async function recordProductClick(productId: string, sourcePage: SourcePage): Promise<void> {
  const token = await getSession()
  if (!token) return

  try {
    await apiClient('/history/product-click', {
      method: 'POST',
      body: JSON.stringify({ productId, sourcePage }),
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // fire-and-forget
  }
}
