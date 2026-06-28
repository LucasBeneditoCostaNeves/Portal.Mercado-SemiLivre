import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductDetail } from '@/services/catalog.service'
import Breadcrumbs from './_components/breadcrumbs'
import ProductGallery from './_components/product-gallery'
import ProductInfo from './_components/product-info'
import PriceBox from './_components/price-box'
import ProductInfoCards from './_components/product-info-cards'
import ProductSpecs from './_components/product-specs'
import ProductReviewsSection from './_components/product-reviews-section'
import Navbar from '../../_components/navbar'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProductDetail(id)
    return { title: product.title }
  } catch {
    return { title: 'Produto não encontrado' }
  }
}

function ReviewsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-[var(--color-border)] animate-pulse">
      <div className="h-6 w-48 bg-[var(--color-bg-secondary)] rounded" />
      <div className="flex gap-10">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="h-12 w-16 bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-24 bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-3 w-20 bg-[var(--color-bg-secondary)] rounded" />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 bg-[var(--color-bg-secondary)] rounded" />
              <div className="h-2 flex-1 bg-[var(--color-bg-secondary)] rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 pb-4 border-b border-[var(--color-border)]"
          >
            <div className="h-3 w-24 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-4 w-3/4 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params
  const resolvedSearchParams = await searchParams

  let product
  try {
    product = await getProductDetail(id)
  } catch {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-6">
        <Breadcrumbs category={product.category} productTitle={product.title} />

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6 pb-6 border-b border-[var(--color-border)]">
          <ProductGallery
            imageUrl={product.imageUrl}
            images={product.images}
            title={product.title}
          />

          <div className="flex flex-col gap-6">
            <ProductInfo
              title={product.title}
              rating={product.rating}
              reviewCount={product.reviewCount}
              seller={product.seller}
              badge={product.badge}
              description={product.description}
            />
            <PriceBox
              price={product.price}
              installments={product.installments}
              freeShipping={product.freeShipping}
              variationId={product.variations[0]?.id ?? ''}
            />
          </div>
        </div>

        <ProductInfoCards warrantyInformation={product.warrantyInformation} />

        <ProductSpecs variations={product.variations} />

        <Suspense fallback={<ReviewsSectionSkeleton />}>
          <ProductReviewsSection
            productId={id}
            searchParams={resolvedSearchParams}
          />
        </Suspense>
      </main>
    </>
  )
}
