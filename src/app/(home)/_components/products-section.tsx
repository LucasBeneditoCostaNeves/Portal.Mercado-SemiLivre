import { Product } from "@/domain/catalog/types";
import ProductCard from "./product-card";
import SectionHeader from "./section-header";

type Props = {
  title: string;
  products: Product[];
  href?: string;
  linkLabel?: string;
};

export default function ProductsSection({ title, products, href, linkLabel }: Props) {
  return (
    <section>
      <SectionHeader title={title} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
