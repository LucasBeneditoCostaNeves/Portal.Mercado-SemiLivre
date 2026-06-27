import type { Department, Product, ProductDetail } from '@/domain/catalog/types'

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
