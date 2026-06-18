'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerWithEmail } from '../actions'
import type { RegisterFormState } from '@/domain/auth/types'
import { GoogleSignInButton } from './google-signin-button'
import { Divider } from './divider'
import { FormField } from './form-field'
import { SubmitButton } from './submit-button'
import { MobileFeatureRow } from './mobile-feature-row'

const INITIAL_STATE: RegisterFormState = {}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerWithEmail, INITIAL_STATE)

  if (state.success) {
    return (
      <p role="status" className="text-center py-4 text-green-400 font-medium text-sm">
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <GoogleSignInButton />

      <Divider label="ou preencha seus dados" />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="firstName"
          name="firstName"
          label="Nome"
          placeholder="Lucas"
          autoComplete="given-name"
          error={state.errors?.firstName?.[0]}
        />
        <FormField
          id="lastName"
          name="lastName"
          label="Sobrenome"
          placeholder="Benedito"
          autoComplete="family-name"
          error={state.errors?.lastName?.[0]}
        />
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

      <FormField
        id="password"
        name="password"
        label="Senha"
        type="password"
        placeholder="Mínimo 6 caracteres"
        autoComplete="new-password"
        error={state.errors?.password?.[0]}
      />

      <SubmitButton label="Criar conta grátis" />

      <div className="lg:hidden">
        <MobileFeatureRow />
      </div>

      <div className="flex flex-col items-center gap-2 pt-1 text-sm text-zinc-400">
        <p>
          Já tem conta?{' '}
          <Link href="/login" className="text-[#FFE600] hover:underline font-medium">
            Entrar
          </Link>
        </p>
        <Link href="#" className="underline hover:text-zinc-300 transition-colors">
          Criar uma conta corporativa
        </Link>
      </div>
    </form>
  )
}
