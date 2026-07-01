'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { authenticatedFetch } from '@/services/cart.service'
import { validateCoupon } from '@/services/coupon.service'
import type { CouponActionResult } from '@/types/coupon'

export async function addToCart(productVariationId: string, quantity: number) {
  const token = await getSession()
  if (!token) return { error: 'Não autenticado' }

  try {
    await authenticatedFetch('/cart/items', token, {
      method: 'POST',
      body: JSON.stringify({ productVariationId, quantity }),
    })
    revalidatePath('/carrinho')
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao adicionar ao carrinho' }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const token = await getSession()
  if (!token) return { error: 'Não autenticado' }

  try {
    await authenticatedFetch(`/cart/items/${cartItemId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
    revalidatePath('/carrinho')
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao atualizar quantidade' }
  }
}

export async function removeCartItem(cartItemId: string) {
  const token = await getSession()
  if (!token) return { error: 'Não autenticado' }

  try {
    await authenticatedFetch(`/cart/items/${cartItemId}`, token, {
      method: 'DELETE',
    })
    revalidatePath('/carrinho')
    return { success: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro ao remover item' }
  }
}

export async function applyCouponAction(
  code: string,
  cartItemIds: string[],
): Promise<CouponActionResult> {
  const token = await getSession()
  if (!token) return { error: 'Não autenticado' }

  try {
    const coupon = await validateCoupon({ code, cartItemIds }, token)
    return { success: true, coupon }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Cupom inválido' }
  }
}

export async function removeCouponAction(): Promise<{ success: boolean }> {
  return { success: true }
}
