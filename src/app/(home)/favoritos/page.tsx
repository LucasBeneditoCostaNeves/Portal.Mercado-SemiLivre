import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getFavorites } from '@/services/favorites.service'
import Navbar from '../_components/navbar'
import FavoritesList from './_components/favorites-list'

export const metadata: Metadata = {
  title: 'Meus Favoritos',
  description: 'Veja e gerencie seus produtos favoritos no Mercado Semilivre.',
}

export default async function FavoritosPage() {
  const token = await getSession()

  if (!token) {
    redirect('/login')
  }

  const favorites = await getFavorites(token)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
            Meus Favoritos
            {favorites.total > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-text-secondary)]">
                ({favorites.total})
              </span>
            )}
          </h1>

          <FavoritesList items={favorites.items} token={token} />
        </main>
      </div>
    </>
  )
}
