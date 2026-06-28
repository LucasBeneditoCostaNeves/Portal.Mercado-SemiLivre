import { GoogleIcon } from '@/components/ui/google-icon'

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-bg-elevated)] active:opacity-80 transition-colors cursor-pointer"
    >
      <GoogleIcon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium text-[var(--color-text-primary)]">
        Continuar com o Google
      </span>
    </button>
  )
}
