'use client'

import { useActionState, useEffect, useState } from 'react'
import { savePreferences } from '../actions'
import type { PreferencesFormState } from '@/domain/auth/types'

type PreferencesFormProps = {
  onSuccess: () => void
}

type Category = {
  id: string
  label: string
  subtitle: string
  icon: React.ReactNode
}

const CATEGORIES: Category[] = [
  {
    id: 'eletronicos',
    label: 'Eletrônicos',
    subtitle: 'Smartphones, TVs e mais',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'moda',
    label: 'Moda',
    subtitle: 'Roupas, calçados e acessórios',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2l-4 4-4-4-4.38 1.46A2 2 0 006 5.37V21a1 1 0 001 1h10a1 1 0 001-1V5.37a2 2 0 00-1.62-1.91z"/>
      </svg>
    ),
  },
  {
    id: 'casa-decoracao',
    label: 'Casa e decoração',
    subtitle: 'Móveis, utensílios e objetos',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    id: 'esportes',
    label: 'Esportes',
    subtitle: 'Equipamentos e vestuário',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l-3.54 3.54M4.93 19.07l4.24-4.24"/>
      </svg>
    ),
  },
]

const INITIAL_STATE: PreferencesFormState = {}

export function PreferencesForm({ onSuccess }: PreferencesFormProps) {
  const [state, formAction, isPending] = useActionState(savePreferences, INITIAL_STATE)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {selectedCategories.map((id) => (
        <input key={id} type="hidden" name="categories" value={id} />
      ))}

      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={[
                'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                isSelected
                  ? 'border-[var(--color-brand)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-bg-elevated)]',
              ].join(' ')}
            >
              <span className={isSelected ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-secondary)]'}>
                {category.icon}
              </span>
              <span className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">{category.label}</span>
              <span className="text-xs text-[var(--color-text-secondary)] leading-tight">{category.subtitle}</span>
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[var(--color-brand)] text-[var(--color-brand-dark)] font-bold py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Salvando…' : 'Concluir cadastro →'}
        </button>

        <button
          type="button"
          onClick={onSuccess}
          className="w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-2"
        >
          Pular por enquanto
        </button>
      </div>
    </form>
  )
}
