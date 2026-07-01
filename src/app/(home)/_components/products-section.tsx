import { Product } from '@/domain/catalog/types'
import ProductCard from './product-card'
import SectionHeader from './section-header'

type Props = {
  title: string
  products: Product[]
  href?: string
  linkLabel?: string
  favoritesMap?: Record<string, string>
}

export default function ProductsSection({
  title,
  products,
  href,
  linkLabel,
  favoritesMap = {},
}: Props) {
  return (
    <section>
      <SectionHeader title={title} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sourcePage="home"
            initialIsFavorite={product.id in favoritesMap}
            initialFavoriteId={favoritesMap[product.id] ?? null}
          />
        ))}
      </div>
    </section>
  )
}
