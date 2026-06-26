'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginWithEmail } from '@/app/login/actions'
import type { LoginFormState } from '@/domain/auth/types'
import { FormField } from '@/components/ui/form-field'
import { GoogleIcon } from '@/components/ui/google-icon'
import { PasswordField } from './password-field'

const INITIAL_STATE: LoginFormState = {}

function GoogleButton() {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] opacity-50 cursor-not-allowed"
    >
      <GoogleIcon className="w-5 h-5 shrink-0" />
      Continuar com o Google
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginWithEmail, INITIAL_STATE)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div>
        <h2 className="hidden lg:block text-3xl font-bold text-[var(--color-text-primary)]">Entrar na sua conta</h2>
        <p className="hidden lg:block mt-1 text-[var(--color-text-secondary)]">Bem-vindo de volta ao Mercado Livre</p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">ou entre com seu e-mail</span>
        <hr className="flex-1 border-[var(--color-border)]" />
      </div>

      <FormField
        id="email"
        name="email"
        label="E-mail"
        type="email"
        placeholder="exemplo@email.com"
        autoComplete="email"
        error={state.errors?.email?.[0]}
      />

      <PasswordField
        name="password"
        label="Senha"
        placeholder="Sua senha"
        autoComplete="current-password"
        error={state.errors?.password?.[0]}
      />

      <div className="flex justify-end -mt-1">
        <Link href="#" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
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
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--color-brand-dark)] hover:opacity-90 active:opacity-80 text-[var(--color-brand)] text-sm font-bold rounded-xl transition-opacity"
      >
        Entrar
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Não tem conta?{' '}
        <Link href="/cadastro" className="text-[var(--color-brand-dark)] hover:underline font-medium">
          Criar conta grátis
        </Link>
      </p>

      <div className="flex items-center justify-center gap-2 pt-2 border-t border-[var(--color-border)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[var(--color-text-secondary)] shrink-0" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-xs text-[var(--color-text-secondary)]">Conexão segura com criptografia SSL</span>
      </div>
    </form>
  )
}
