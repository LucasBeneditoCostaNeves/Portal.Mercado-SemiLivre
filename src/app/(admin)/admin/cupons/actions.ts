'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { decodeJwt } from '@/lib/jwt'
import { createCoupon, updateCoupon } from '@/services/coupon.service'
import type { CreateCouponData } from '@/services/coupon.service'

function parseFormData(formData: FormData, adminId: string): CreateCouponData {
  const scope = formData.get('scope') as CreateCouponData['scope']
  const discountType = formData.get('discountType') as CreateCouponData['discountType']
  const productId = scope === 'product' ? (formData.get('productId') as string) : undefined
  const sellerId =
    scope !== 'global' ? (formData.get('sellerId') as string | null) ?? undefined : undefined
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
    createdByRole: 'admin',
    createdById: adminId,
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

export async function createAdminCouponAction(formData: FormData) {
  const token = await getSession()
  if (!token) redirect('/login')

  const payload = decodeJwt(token)
  const adminId = payload?.sub as string

  const data = parseFormData(formData, adminId)
  await createCoupon(data, token)
  redirect('/admin/cupons')
}

export async function updateAdminCouponAction(id: string, formData: FormData) {
  const token = await getSession()
  if (!token) redirect('/login')

  const payload = decodeJwt(token)
  const adminId = payload?.sub as string

  const data = parseFormData(formData, adminId)
  await updateCoupon(id, data, token)
  redirect('/admin/cupons')
}

export async function deactivateAdminCouponAction(id: string) {
  const token = await getSession()
  if (!token) redirect('/login')

  await updateCoupon(id, { isActive: false }, token)
  redirect('/admin/cupons')
}
