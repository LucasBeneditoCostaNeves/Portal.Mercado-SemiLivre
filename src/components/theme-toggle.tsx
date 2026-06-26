'use client'

import { useTheme } from './theme-provider'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={`flex flex-col items-center gap-0.5 text-[var(--color-brand-dark)] hover:opacity-75 transition-opacity ${className ?? ''}`}
    >
      {isDark ? (
        <i className="ti ti-sun text-lg" aria-hidden="true" />
      ) : (
        <i className="ti ti-moon text-lg" aria-hidden="true" />
      )}
      <span className="text-[10px] whitespace-nowrap">{isDark ? 'Claro' : 'Escuro'}</span>
    </button>
  )
}
