'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginWithEmail } from '@/app/login/actions'
import type { LoginFormState } from '@/domain/auth/types'
import { PasswordField } from './PasswordField'

const INITIAL_STATE: LoginFormState = {}

function EmailField({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-sm text-zinc-400">
        E-mail
      </label>
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          placeholder="exemplo@email.com"
          autoComplete="email"
          aria-describedby={error ? 'email-error' : undefined}
          aria-invalid={!!error}
          className="w-full px-4 py-3 pr-11 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </span>
      </div>
      {error && (
        <p id="email-error" role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function GoogleButton() {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-zinc-500 opacity-50 cursor-not-allowed"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Continuar com o Google
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginWithEmail, INITIAL_STATE)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div>
        <h2 className="hidden lg:block text-3xl font-bold text-white">Entrar na sua conta</h2>
        <p className="hidden lg:block mt-1 text-zinc-400">Bem-vindo de volta ao Mercado Livre</p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-zinc-700" />
        <span className="text-xs text-zinc-500 whitespace-nowrap">ou entre com seu e-mail</span>
        <hr className="flex-1 border-zinc-700" />
      </div>

      <EmailField error={state.errors?.email?.[0]} />

      <PasswordField
        name="password"
        label="Senha"
        placeholder="Sua senha"
        autoComplete="current-password"
        error={state.errors?.password?.[0]}
      />

      <div className="flex justify-end -mt-1">
        <Link href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">
          Esqueci minha senha
        </Link>
      </div>

      {state.message && !state.success && (
        <p role="alert" className="text-sm text-red-400 text-center">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2D3277] hover:bg-[#232869] active:bg-[#1a1f6e] text-[#FFE600] text-sm font-bold rounded-xl transition-colors"
      >
        Entrar
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      <p className="text-center text-sm text-zinc-400">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-[#FFE600] hover:underline font-medium">
          Criar conta grátis
        </Link>
      </p>

      <div className="flex items-center justify-center gap-2 pt-2 border-t border-zinc-800">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-zinc-600 shrink-0" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-zinc-600">Conexão segura com criptografia SSL</span>
      </div>
    </form>
  )
}
