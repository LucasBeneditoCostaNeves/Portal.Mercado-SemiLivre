import type { Coupon, CouponValidateRequest, CouponValidateResponse } from '@/types/coupon'
import { authenticatedFetch } from './cart.service'

export type CouponFilters = {
  scope?: Coupon['scope']
  sellerId?: string
  isActive?: boolean
}

export type CreateCouponData = Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>

export async function validateCoupon(
  data: CouponValidateRequest,
  token: string,
): Promise<CouponValidateResponse> {
  return authenticatedFetch<CouponValidateResponse>('/coupons/validate', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function createCoupon(data: CreateCouponData, token: string): Promise<Coupon> {
  return authenticatedFetch<Coupon>('/coupons', token, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function listCoupons(filters: CouponFilters, token: string): Promise<Coupon[]> {
  const params = new URLSearchParams()
  if (filters.scope) params.set('scope', filters.scope)
  if (filters.sellerId) params.set('sellerId', filters.sellerId)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))

  const query = params.toString()
  return authenticatedFetch<Coupon[]>(`/coupons${query ? `?${query}` : ''}`, token)
}

export async function updateCoupon(
  id: string,
  data: Partial<CreateCouponData>,
  token: string,
): Promise<Coupon> {
  return authenticatedFetch<Coupon>(`/coupons/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteCoupon(id: string, token: string): Promise<void> {
  return authenticatedFetch<void>(`/coupons/${id}`, token, { method: 'DELETE' })
}
