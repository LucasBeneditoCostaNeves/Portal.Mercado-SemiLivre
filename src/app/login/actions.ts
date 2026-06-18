'use server'

import type { LoginFormState } from '@/domain/auth/types'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function loginWithEmail(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email    = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString()     ?? ''

  const errors: LoginFormState['errors'] = {}

  if (!email) {
    errors.email = ['E-mail é obrigatório.']
  } else if (!isValidEmail(email)) {
    errors.email = ['Digite um e-mail válido.']
  }

  if (!password) {
    errors.password = ['Senha é obrigatória.']
  } else if (password.length < 6) {
    errors.password = ['A senha deve ter pelo menos 6 caracteres.']
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  return { success: false, message: 'Credenciais inválidas.' }
}
