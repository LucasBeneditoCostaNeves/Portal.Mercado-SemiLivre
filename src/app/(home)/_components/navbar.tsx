import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { decodeJwt } from '@/lib/jwt'
import { getSession } from '@/lib/session'
import { fetchSearchHistory } from '@/services/history.service'
import { SearchForm } from './search-form'

function SearchFormFallback() {
  return (
    <div className="flex items-center w-full bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-yellow-300">
      <input
        type="text"
        placeholder="Buscar produtos, marcas e muito mais…"
        className="flex-1 h-10 px-4 text-sm text-zinc-700 outline-none bg-transparent placeholder:text-zinc-400"
        disabled
      />
      <div className="h-10 px-4 bg-[var(--color-brand)] border-l border-yellow-300" />
    </div>
  )
}

async function SearchFormWithHistory() {
  const searchHistory = await fetchSearchHistory()
  return <SearchForm searchHistory={searchHistory} />
}

const navLinkClass =
  'flex flex-col items-center gap-0.5 text-[var(--color-brand-dark)] px-2 py-1 rounded-lg hover:bg-black/10 transition-colors'

async function UserButton() {
  const token = await getSession()

  if (!token) {
    return (
      <Link href="/login" className={navLinkClass}>
        <i className="ti ti-user text-xl" aria-hidden="true" />
        <span className="text-[11px] font-medium whitespace-nowrap">Entrar</span>
      </Link>
    )
  }

  const payload = decodeJwt(token)
  const name = typeof payload?.name === 'string' ? payload.name : null
  const initial = name ? name.charAt(0).toUpperCase() : null

  return (
    <Link href="/perfil" className={navLinkClass}>
      <span className="w-7 h-7 rounded-full bg-[var(--color-white)] text-[var(--color-brand-black)] flex items-center justify-center text-sm font-bold">
        {initial ?? <i className="ti ti-user text-base" aria-hidden="true" />}
      </span>
      <span className="text-[11px] font-medium whitespace-nowrap">
        {name ? '' : 'Minha conta'}
      </span>
    </Link>
  )
}

export default async function Navbar() {
  return (
    <header className="bg-[var(--color-brand)] px-4 lg:px-10 py-3 shadow-md">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 max-w-[1200px] m-auto">
        <Link href="/" className="flex items-center shrink-0 order-1">
          <Image
            src="/logo-mercadoSemilivre.png"
            alt="Mercado Semilivre"
            width={108}
            height={36}
            priority
            style={{ height: 'auto' }}
            className="rounded-xl navbar-logo"
          />
        </Link>

        <nav
          className="flex items-center gap-1 ml-auto shrink-0 order-2 lg:order-3"
          aria-label="Ações do usuário"
        >
          <UserButton />
          <Link href="#" className={navLinkClass}>
            <Image
              src="/icon-request.svg"
              alt=""
              width={40}
              height={40}
              aria-hidden="true"
            />
          </Link>
          <Link href="/favoritos" className={navLinkClass}>
            <i className="ti ti-heart text-xl" aria-hidden="true" />
            <Image
              src="/icon-favorite.png"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
          </Link>
          <Link href="/carrinho" className={navLinkClass}>
            <span className="relative">
              <Image
                src="/icon-cart.svg"
                alt=""
                width={25}
                height={25}
                aria-hidden="true"
              />
              <span className="absolute -top-1.5 -right-2 bg-[var(--color-brand-dark)] text-[var(--color-brand)] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                3
              </span>
            </span>
          </Link>
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </nav>

        <div className="w-full order-3 lg:order-2 lg:w-auto lg:flex-1">
          <Suspense fallback={<SearchFormFallback />}>
            <SearchFormWithHistory />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
