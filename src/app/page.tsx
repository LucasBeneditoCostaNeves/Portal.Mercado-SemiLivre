import Navbar from "./(home)/_components/navbar";
import Subnav from "./(home)/_components/subnav";
import HeroBanner from "./(home)/_components/hero-banner";
import DepartmentsGrid from "./(home)/_components/departments-grid";
import ProductsSection from "./(home)/_components/products-section";
import PromoRow from "./(home)/_components/promo-row";
import HomeFooter from "./(home)/_components/home-footer";
import SectionHeader from "./(home)/_components/section-header";
import { getBestsellers, getDepartments, getRecommended } from "@/services/catalog.service";

export default async function Home() {
  const [bestsellers, recommended, departments] = await Promise.all([
    getBestsellers(7),
    getRecommended(7),
    getDepartments(),
  ]);

  return (
    <div className="flex flex-col min-h-full bg-[var(--color-bg-primary)]">
      <Navbar />
      <Subnav />

      <main className="flex-1 flex flex-col gap-5 px-4 lg:px-6 py-5">
        <HeroBanner />

        <section>
          <SectionHeader title="Departamentos" href="#" />
          <DepartmentsGrid departments={departments} />
        </section>

        <ProductsSection
          title="Mais vendidos"
          products={bestsellers}
          href="#"
        />

        <PromoRow />

        <ProductsSection
          title="Recomendados para você"
          products={recommended}
          href="#"
          linkLabel="Ver mais"
        />
      </main>

      <HomeFooter />
    </div>
  );
}
