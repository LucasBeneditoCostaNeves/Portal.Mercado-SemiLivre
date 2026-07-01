'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { UserSearchHistoryItem } from '@/types/history'

type Props = {
  searchHistory?: UserSearchHistoryItem[]
}

export function SearchForm({ searchHistory = [] }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(q)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const hasHistory = searchHistory.length > 0

  useEffect(() => {
    setInputValue(q)
  }, [q])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleFocus() {
    if (hasHistory) setOpen(true)
  }

  function handleSelect(term: string) {
    setInputValue(term)
    setOpen(false)
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const term = inputValue.trim()
    if (term.length < 2) return
    setOpen(false)
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
  }

  const visibleHistory = searchHistory.slice(0, 5)

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Buscar produtos"
        className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-yellow-300 focus-within:ring-2 focus-within:ring-yellow-400 transition-shadow"
      >
        <input
          type="text"
          name="q"
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          placeholder="Buscar produtos, marcas e muito mais…"
          className="flex-1 h-10 px-4 text-sm text-zinc-700 outline-none bg-transparent placeholder:text-zinc-400"
          autoComplete="off"
        />
        <button
          type="submit"
          className="h-10 px-4 bg-[var(--color-brand)] border-l border-yellow-300 text-[var(--color-brand-dark)] hover:bg-yellow-400 transition-colors"
          aria-label="Buscar"
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M7.79001 13.4556C10.919 13.4556 13.4555 10.919 13.4555 7.79007C13.4555 4.6611 10.919 2.12457 7.79001 2.12457C4.66104 2.12457 2.12451 4.6611 2.12451 7.79007C2.12451 10.919 4.66104 13.4556 7.79001 13.4556Z" stroke="currentColor" strokeWidth="1.55801" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.8719 14.8719L11.8267 11.8267" stroke="currentColor" strokeWidth="1.55801" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>

      {open && hasHistory && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide px-3 pt-2.5 pb-1">
            Buscas recentes
          </p>
          <ul role="listbox">
            {visibleHistory.map((item) => (
              <li key={item.term}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(item.term)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left"
                >
                  <i className="ti ti-clock text-zinc-400 text-xs shrink-0" aria-hidden="true" />
                  {item.term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
