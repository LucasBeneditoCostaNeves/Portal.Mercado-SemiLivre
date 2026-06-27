import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductDetail } from '@/services/catalog.service'
import Breadcrumbs from './_components/breadcrumbs'
import ProductGallery from './_components/product-gallery'
import ProductInfo from './_components/product-info'
import PriceBox from './_components/price-box'
import ProductInfoCards from './_components/product-info-cards'
import ProductSpecs from './_components/product-specs'
import Navbar from '../../_components/navbar'

type Props = {
  params: Promise<{ id: string }>
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

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

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
            />
          </div>
        </div>

        <ProductInfoCards warrantyInformation={product.warrantyInformation} />

        <ProductSpecs variations={product.variations} />
      </main>
    </>
  )
}
