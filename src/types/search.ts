import type { PaginatedProductsResponse } from '@/domain/catalog/types'

export type SortField = 'price' | 'rating' | 'sales'
export type SortOrder = 'asc' | 'desc'

export type SortOption = {
  label: string
  sort?: SortField
  order?: SortOrder
}

export type SearchParams = {
  limit?: number
  offset?: number
  sort?: SortField
  order?: SortOrder
  freeShipping?: boolean
  minPrice?: number
  maxPrice?: number
  minRating?: number
  brand?: string[]
  category?: string[]
}

export type SearchResult = PaginatedProductsResponse

export type FilterState = {
  freeShipping: boolean
  minPrice: string
  maxPrice: string
  minRating: number
  brands: string[]
  categories: string[]
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevância' },
  { label: 'Menor preço', sort: 'price', order: 'asc' },
  { label: 'Maior preço', sort: 'price', order: 'desc' },
  { label: 'Melhor avaliação', sort: 'rating', order: 'desc' },
  { label: 'Mais vendidos', sort: 'sales', order: 'desc' },
]
