import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { SearchParams } from '@/types/search'
import { searchProducts } from '@/services/catalog.service'
import { recordSearch } from '@/services/history.service'
import { getFavoritesMap } from '@/services/favorites.service'
import { getSession } from '@/lib/session'
import SearchHeader from './_components/search-header'
import SearchResultsClient from './_components/search-results-client'
import FiltersPanel from './_components/filters-panel'
import SortSelect from './_components/sort-select'
import EmptySearchState from './_components/empty-search-state'
import Navbar from '../_components/navbar'

type PageSearchParams = {
  q?: string
  sort?: string
  order?: string
  freeShipping?: string
  minPrice?: string
  maxPrice?: string
  minRating?: string
  brand?: string
  category?: string
}

type Props = {
  searchParams: Promise<PageSearchParams>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  return {
    title: `Resultados para "${q}" | Mercado SemiLivre`,
    robots: { index: false, follow: false },
  }
}

export default async function BuscarPage({ searchParams }: Props) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''

  if (q.length < 2) redirect('/')

  const token = (await getSession()) ?? null

  await recordSearch(q, token)

  const filters: SearchParams = {
    limit: 20,
    offset: 0,
    sort: params.sort as SearchParams['sort'],
    order: params.order as SearchParams['order'],
    freeShipping: params.freeShipping === 'true' ? true : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    brand: params.brand ? params.brand.split(',') : undefined,
    category: params.category ? params.category.split(',') : undefined,
  }

  const [result, favoritesMap] = await Promise.all([
    searchProducts(q, filters),
    token ? getFavoritesMap(token) : Promise.resolve({}),
  ])

  const availableBrands = [
    ...new Set(
      result.items
        .map((p) => (p as { brand?: string }).brand)
        .filter((b): b is string => Boolean(b))
    ),
  ]

  const availableCategories: string[] = []

  if (result.total === 0) {
    return (
      <div>
        <Navbar />
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
          <SearchHeader query={q} total={0} />
          <EmptySearchState query={q} />
        </main>
      </div>
    )
  }

  const filtersKey = JSON.stringify({ q, ...filters })

  return (
    <div>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <SearchHeader query={q} total={result.total} />

        <div className="flex items-center justify-between gap-4 lg:hidden">
          <Suspense>
            <FiltersPanel
              query={q}
              availableBrands={availableBrands}
              availableCategories={availableCategories}
            />
          </Suspense>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block">
            <Suspense>
              <FiltersPanel
                query={q}
                availableBrands={availableBrands}
                availableCategories={availableCategories}
              />
            </Suspense>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="hidden lg:flex justify-end">
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>

            <SearchResultsClient
              key={filtersKey}
              initialItems={result.items}
              initialHasMore={result.hasMore}
              query={q}
              filters={filters}
              favoritesMap={favoritesMap}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
