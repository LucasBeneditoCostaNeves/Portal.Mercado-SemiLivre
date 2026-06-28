import type {
  Department,
  PaginatedProductsResponse,
  Product,
  ProductDetail,
  ProductReviewsResponse,
} from '@/domain/catalog/types'
import type { CategoryPageSearchParams } from '@/types/category'
import type { SearchParams, SearchResult } from '@/types/search'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function catalogFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 60 },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Catalog API error ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}

function buildSearchQuery(query: string, params: SearchParams): string {
  const qs = new URLSearchParams()
  qs.set('q', query)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))
  if (params.sort) qs.set('sort', params.sort)
  if (params.order) qs.set('order', params.order)
  if (params.freeShipping) qs.set('freeShipping', 'true')
  if (params.minPrice !== undefined) qs.set('minPrice', String(params.minPrice))
  if (params.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice))
  if (params.minRating !== undefined)
    qs.set('minRating', String(params.minRating))
  if (params.brand?.length) qs.set('brand', params.brand.join(','))
  if (params.category?.length) qs.set('category', params.category.join(','))
  return qs.toString()
}

export async function getBestsellers(limit: number): Promise<Product[]> {
  const data = await catalogFetch<{ items: Product[] }>(
    `/catalog/products?category=bestsellers&limit=${limit}`
  )
  return data.items
}

export async function getRecommended(limit: number): Promise<Product[]> {
  const data = await catalogFetch<{ items: Product[] }>(
    `/catalog/products?category=recommended&limit=${limit}`
  )
  return data.items
}

export async function getDepartments(): Promise<Department[]> {
  const data = await catalogFetch<{ items: Department[] }>(
    '/catalog/departments'
  )
  return data.items
}

export async function getProductDetail(id: string): Promise<ProductDetail> {
  return catalogFetch<ProductDetail>(`/catalog/products/${id}`, {
    next: { revalidate: 3600 },
  })
}

type ReviewsParams = {
  page?: number
  limit?: number
  rating?: number
  sort?: 'recent' | 'top'
}

export async function getProductReviews(
  id: string,
  params: ReviewsParams = {}
): Promise<ProductReviewsResponse> {
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.rating) qs.set('rating', String(params.rating))
  if (params.sort) qs.set('sort', params.sort)
  const query = qs.toString()
  return catalogFetch<ProductReviewsResponse>(
    `/catalog/products/${id}/reviews${query ? `?${query}` : ''}`,
    { next: { revalidate: 300 } }
  )
}

export async function getProductsByCategory(
  categoryId: string,
  params: CategoryPageSearchParams & { offset?: number; limit?: number } = {}
): Promise<PaginatedProductsResponse> {
  const qs = new URLSearchParams()
  qs.set('category', categoryId)
  qs.set('limit', String(params.limit ?? 20))
  if (params.offset) qs.set('offset', String(params.offset))
  if (params.sort) qs.set('sort', params.sort)
  if (params.order) qs.set('order', params.order)
  if (params.freeShipping === 'true') qs.set('freeShipping', 'true')
  if (params.minPrice) qs.set('minPrice', params.minPrice)
  if (params.maxPrice) qs.set('maxPrice', params.maxPrice)
  if (params.minRating) qs.set('minRating', params.minRating)
  if (params.brand) qs.set('brand', params.brand)
  return catalogFetch<PaginatedProductsResponse>(`/catalog/products?${qs}`, {
    next: { revalidate: 30 },
  })
}

export async function searchProducts(
  query: string,
  params: SearchParams
): Promise<SearchResult> {
  const qs = buildSearchQuery(query, { limit: 20, ...params })
  return catalogFetch<SearchResult>(`/catalog/products?${qs}`, {
    next: { revalidate: 30 },
  })
}
