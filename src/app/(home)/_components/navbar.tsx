import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchForm } from './search-form'

function SearchFormFallback() {
  return (
    <div className="flex items-center flex-1 min-w-[200px] bg-white rounded-lg overflow-hidden border border-yellow-300 order-3 lg:order-none w-full lg:w-auto">
      <input
        type="text"
        placeholder="Buscar produtos, marcas e muito mais…"
        className="flex-1 h-9 px-3 text-sm text-zinc-700 outline-none bg-transparent placeholder:text-zinc-400 rounded-lg"
        disabled
      />
      <div className="h-9 px-3 bg-[var(--color-brand)] border-l border-yellow-300" />
    </div>
  )
}

export default function Navbar() {
  return (
    <header className="bg-[var(--color-brand)] px-6 lg:px-10 py-3 ">
      <div className="flex flex-wrap items-center gap-3 max-w-[1200px] m-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-mercadoSemilivre.png"
            alt="Mercado Semilivre"
            width={101}
            height={34}
            priority
            style={{ height: 'auto' }}
            className="xl:top-14 xl:left-0 rounded-xl"
          />
        </Link>

        <Suspense fallback={<SearchFormFallback />}>
          <SearchForm />
        </Suspense>

        <nav
          className="flex items-center gap-4 shrink-0 ml-auto lg:ml-0"
          aria-label="Ações do usuário"
        >
          <Link
            href="/login"
            className="flex flex-col items-center gap-0.5 text-[var(--color-brand-dark)] hover:opacity-75 transition-opacity"
          >
            <i className="ti ti-user text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Entrar</span>
          </Link>
          <Link
            href="#"
            className="flex flex-col items-center gap-0.5 text-[var(--color-brand-dark)] hover:opacity-75 transition-opacity"
          >
            <i className="ti ti-package text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Pedidos</span>
          </Link>
          <Link
            href="#"
            className="relative flex flex-col items-center gap-0.5 text-[var(--color-brand-dark)] hover:opacity-75 transition-opacity"
          >
            <i className="ti ti-shopping-cart text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Carrinho</span>
            <span className="absolute -top-1 -right-2 bg-[var(--color-brand-dark)] text-[var(--color-brand)] text-[9px] font-medium w-3.5 h-3.5 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
