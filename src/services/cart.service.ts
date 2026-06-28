import type { Cart } from '@/types/cart'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function authenticatedFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = await res.json()
      if (typeof body?.message === 'string') message = body.message
    } catch {
      // resposta sem JSON
    }
    throw new Error(`API ${res.status}: ${message}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function getCart(token: string): Promise<Cart> {
  return authenticatedFetch<Cart>('/cart', token, { cache: 'no-store' })
}
