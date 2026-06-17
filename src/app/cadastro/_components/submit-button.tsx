'use client'

import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel = 'Carregando...' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
