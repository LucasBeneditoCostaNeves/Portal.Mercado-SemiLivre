'use client'

import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
  label: string
  pendingLabel?: string
}

export function SubmitButton({
  label,
  pendingLabel = 'Carregando...',
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-primary)] text-sm font-bold rounded-xl transition-colors"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
