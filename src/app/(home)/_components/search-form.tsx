'use client'

import { useSearchParams } from 'next/navigation'

export function SearchForm() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  return (
    <form
      action="/buscar"
      method="GET"
      role="search"
      aria-label="Buscar produtos"
      className="flex items-center flex-1 min-w-[200px] bg-white rounded-lg overflow-hidden border border-yellow-300 order-3 lg:order-none w-full lg:w-auto"
    >
      <input
        type="text"
        name="q"
        required
        defaultValue={q}
        placeholder="Buscar produtos, marcas e muito mais…"
        className="flex-1 h-9 px-3 text-sm text-zinc-700 outline-none bg-transparent placeholder:text-zinc-400 rounded-lg"
      />
      <button
        type="submit"
        className="h-9 px-3 bg-[var(--color-brand)] border-l border-yellow-300 text-[var(--color-brand-dark)] hover:bg-yellow-400 transition-colors"
        aria-label="Buscar"
      >
        <i className="ti ti-search text-base" aria-hidden="true" />
      </button>
    </form>
  )
}
