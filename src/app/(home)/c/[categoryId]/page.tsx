import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getDepartments,
  getProductsByCategory,
} from '@/services/catalog.service'
import { getFavoritesMap } from '@/services/favorites.service'
import { getSession } from '@/lib/session'
import type { CategoryPageSearchParams } from '@/types/category'
import Navbar from '../../_components/navbar'
import CategoryHeader from './_components/category-header'
import CategoryResultsClient from './_components/category-results-client'

type Props = {
  params: Promise<{ categoryId: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function getString(
  raw: { [key: string]: string | string[] | undefined },
  key: string
): string | undefined {
  const val = raw[key]
  return Array.isArray(val) ? val[0] : val
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params
  try {
    const departments = await getDepartments()
    const dept = departments.find((d) => d.id === categoryId)
    return {
      title: dept ? `${dept.label} | Mercado SemiLivre` : 'Categoria',
    }
  } catch {
    return { title: 'Categoria | Mercado SemiLivre' }
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoryId } = await params
  const rawSearchParams = await searchParams

  const categoryParams: CategoryPageSearchParams = {
    sort: getString(rawSearchParams, 'sort'),
    order: getString(rawSearchParams, 'order'),
    freeShipping: getString(rawSearchParams, 'freeShipping'),
    minPrice: getString(rawSearchParams, 'minPrice'),
    maxPrice: getString(rawSearchParams, 'maxPrice'),
    minRating: getString(rawSearchParams, 'minRating'),
    brand: getString(rawSearchParams, 'brand'),
  }

  const departments = await getDepartments()
  const department = departments.find((d) => d.id === categoryId)
  if (!department) notFound()

  const token = (await getSession()) ?? null

  const [products, favoritesMap] = await Promise.all([
    getProductsByCategory(department.label, { limit: 20, ...categoryParams }),
    token ? getFavoritesMap(token) : Promise.resolve({}),
  ])

  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        <CategoryHeader label={department.label} total={products.total} />
        <CategoryResultsClient
          initialItems={products.items}
          total={products.total}
          initialHasMore={products.hasMore}
          categoryLabel={department.label}
          searchParams={categoryParams}
          favoritesMap={favoritesMap}
        />
      </main>
    </>
  )
}
