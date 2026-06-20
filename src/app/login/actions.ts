'use server'

import { redirect } from 'next/navigation'
import { ApiError } from '@/lib/http-client'
import { setSession } from '@/lib/session'
import { authService } from '@/services/auth.service'
import type { LoginFormState } from '@/domain/auth/types'
import { isValidEmail } from '@/domain/auth/validators'

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

  try {
    const { acess_token } = await authService.login(email, password)
    await setSession(acess_token)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return { success: false, message: 'E-mail ou senha incorretos.' }
    }
    return { success: false, message: 'Erro inesperado. Tente novamente.' }
  }

  redirect('/home')
}
