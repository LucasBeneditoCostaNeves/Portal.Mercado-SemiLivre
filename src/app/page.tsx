export const dynamic = 'force-dynamic'

import Navbar from './(home)/_components/navbar'
import Subnav from './(home)/_components/subnav'
import HeroBanner from './(home)/_components/hero-banner'
import DepartmentsGrid from './(home)/_components/departments-grid'
import ProductsSection from './(home)/_components/products-section'
import PromoRow from './(home)/_components/promo-row'
import HomeFooter from './(home)/_components/home-footer'
import SectionHeader from './(home)/_components/section-header'
import {
  getBestsellers,
  getDepartments,
  getRecommended,
} from '@/services/catalog.service'
import { getFavoritesMap } from '@/services/favorites.service'
import { getSession } from '@/lib/session'

export default async function Home() {
  const token = (await getSession()) ?? null

  const [bestsellers, recommended, departments, favoritesMap] =
    await Promise.all([
      getBestsellers(100),
      getRecommended(100),
      getDepartments(),
      token ? getFavoritesMap(token) : Promise.resolve({}),
    ])

  return (
    <div className="flex flex-col min-h-full bg-[var(--color-bg-primary)]">
      <Navbar />
      {/* <Subnav /> */}

      <main className="flex-1 flex flex-col gap-5 px-6 lg:px-4 py-5 max-w-[1200px] mx-auto w-full">
        <HeroBanner />

        <section>
          <SectionHeader title="Departamentos" href="#" />
          <DepartmentsGrid departments={departments} />
        </section>

        <ProductsSection
          title="Mais vendidos"
          products={bestsellers}
          href="#"
          favoritesMap={favoritesMap}
        />

        <PromoRow />

        <ProductsSection
          title="Recomendados para você"
          products={recommended}
          href="#"
          linkLabel="Ver mais"
          favoritesMap={favoritesMap}
        />
      </main>

      <HomeFooter />
    </div>
  )
}
