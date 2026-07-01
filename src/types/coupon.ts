export type CouponScope = 'global' | 'seller' | 'product'

export type CouponDiscountType = 'percentage' | 'fixed'

export type Coupon = {
  id: string
  code: string
  discountType: CouponDiscountType
  discountValue: number
  scope: CouponScope
  createdByRole: 'admin' | 'seller'
  createdById: string
  sellerId?: string
  productId?: string
  minOrderValue?: number
  maxDiscountValue?: number
  usageLimit?: number
  usageLimitPerUser?: number
  usedCount: number
  startsAt: string
  expiresAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CouponValidateRequest = {
  code: string
  cartItemIds: string[]
}

export type CouponValidateResponse = {
  couponId: string
  code: string
  discountAmount: number
  appliedToItemIds: string[]
}

export type CouponUsage = {
  id: string
  couponId: string
  userId: string
  orderId: string
  discountApplied: number
  usedAt: string
}

export type AppliedCoupon = {
  code: string
  discountAmount: number
}

export type CouponActionResult =
  | { success: true; coupon: CouponValidateResponse }
  | { error: string }

export type CouponFormState = {
  errors?: {
    code?: string[]
    discountValue?: string[]
    startsAt?: string[]
    expiresAt?: string[]
    usageLimit?: string[]
    minOrderValue?: string[]
  }
  message?: string
  success?: boolean
}
