import { GoogleIcon } from '@/components/ui/google-icon'

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-zinc-800 border border-zinc-600 rounded-xl hover:bg-zinc-700 active:bg-zinc-600 transition-colors cursor-pointer"
    >
      <GoogleIcon className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium text-white">Continuar com o Google</span>
    </button>
  )
}
