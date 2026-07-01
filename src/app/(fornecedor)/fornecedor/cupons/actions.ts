'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { decodeJwt } from '@/lib/jwt'
import { createCoupon, updateCoupon, deleteCoupon } from '@/services/coupon.service'
import type { CreateCouponData } from '@/services/coupon.service'

function parseFormData(formData: FormData, sellerId: string): CreateCouponData {
  const scope = formData.get('scope') as CreateCouponData['scope']
  const discountType = formData.get('discountType') as CreateCouponData['discountType']
  const productId = scope === 'product' ? (formData.get('productId') as string) : undefined
  const usageLimit = formData.get('usageLimit') ? Number(formData.get('usageLimit')) : undefined
  const usageLimitPerUser = formData.get('usageLimitPerUser')
    ? Number(formData.get('usageLimitPerUser'))
    : undefined
  const minOrderValue = formData.get('minOrderValue')
    ? Number(formData.get('minOrderValue'))
    : undefined
  const maxDiscountValue = formData.get('maxDiscountValue')
    ? Number(formData.get('maxDiscountValue'))
    : undefined
  const expiresAt = formData.get('expiresAt')
    ? new Date(formData.get('expiresAt') as string).toISOString()
    : undefined

  return {
    code: (formData.get('code') as string).toUpperCase().trim(),
    discountType,
    discountValue: Number(formData.get('discountValue')),
    scope,
    createdByRole: 'seller',
    createdById: sellerId,
    sellerId,
    productId,
    usageLimit,
    usageLimitPerUser,
    minOrderValue,
    maxDiscountValue,
    startsAt: new Date(formData.get('startsAt') as string).toISOString(),
    expiresAt,
    isActive: true,
  }
}

export async function createCouponAction(formData: FormData) {
  const token = await getSession()
  if (!token) redirect('/login')

  const payload = decodeJwt(token)
  const sellerId = payload?.sellerId as string

  const data = parseFormData(formData, sellerId)
  await createCoupon(data, token)
  redirect('/fornecedor/cupons')
}

export async function updateCouponAction(id: string, formData: FormData) {
  const token = await getSession()
  if (!token) redirect('/login')

  const payload = decodeJwt(token)
  const sellerId = payload?.sellerId as string

  const data = parseFormData(formData, sellerId)
  await updateCoupon(id, data, token)
  redirect('/fornecedor/cupons')
}

export async function deactivateCouponAction(id: string) {
  const token = await getSession()
  if (!token) redirect('/login')

  await updateCoupon(id, { isActive: false }, token)
  redirect('/fornecedor/cupons')
}
