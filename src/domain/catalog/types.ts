export type ProductBadge = 'OFERTA' | 'NOVO'

export type Product = {
  id: string
  title: string
  price: number
  installments: string
  freeShipping: boolean
  rating: number
  reviewCount: number
  icon: string
  imageUrl: string
  badge?: ProductBadge
  brand?: string
}

export type PaginatedProductsResponse = {
  items: Product[]
  total: number
  hasMore: boolean
}

export type ProductVariationDetail = {
  id: string
  title: string
  price: number
  quantity: number
  discountPercentage: number
}

export type ProductDetail = {
  id: string
  title: string
  price: number
  installments: string
  freeShipping: boolean
  rating: number
  reviewCount: number
  badge?: ProductBadge
  imageUrl: string
  images: string[]
  description: string
  warrantyInformation: string
  brand: string
  category: string
  seller: string
  variations: ProductVariationDetail[]
}

export type ReviewItem = {
  id: string
  rating: number
  text?: string
  photos: string[]
  country?: string
  createdAt: string
}

export type ReviewDistribution = Record<1 | 2 | 3 | 4 | 5, number>

export type ReviewAggregate = {
  rating: number
  reviewCount: number
  distribution: ReviewDistribution
  photos: string[]
  aiSummary?: string
}

export type ProductReviewsResponse = {
  aggregate: ReviewAggregate
  items: ReviewItem[]
  total: number
  hasMore: boolean
}

export type Department = {
  id: string
  label: string
  icon: string
}

export type PromoCard = {
  id: string
  variant: 'yellow' | 'blue'
  icons: string[]
  title: string
  description: string
  cta: string
}
