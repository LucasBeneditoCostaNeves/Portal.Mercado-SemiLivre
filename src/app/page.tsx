import Navbar from "./(home)/_components/navbar";
import Subnav from "./(home)/_components/subnav";
import HeroBanner from "./(home)/_components/hero-banner";
import DepartmentsGrid from "./(home)/_components/departments-grid";
import ProductsSection from "./(home)/_components/products-section";
import PromoRow from "./(home)/_components/promo-row";
import HomeFooter from "./(home)/_components/home-footer";
import SectionHeader from "./(home)/_components/section-header";
import { mockProducts } from "./(home)/_data/mock-products";
import { mockRecommended } from "./(home)/_data/mock-recommended";
import { mockDepartments } from "./(home)/_data/mock-departments";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-zinc-900">
      <Navbar />
      <Subnav />

      <main className="flex-1 flex flex-col gap-5 px-4 lg:px-6 py-5">
        <HeroBanner />

        <section>
          <SectionHeader title="Departamentos" href="#" />
          <DepartmentsGrid departments={mockDepartments} />
        </section>

        <ProductsSection
          title="Mais vendidos"
          products={mockProducts}
          href="#"
        />

        <PromoRow />

        <ProductsSection
          title="Recomendados para você"
          products={mockRecommended}
          href="#"
          linkLabel="Ver mais"
        />
      </main>

      <HomeFooter />
    </div>
  );
}
