'use server'

import type { RegisterFormState } from '@/domain/auth/types'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function registerWithEmail(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const firstName = formData.get('firstName')?.toString().trim() ?? ''
  const lastName  = formData.get('lastName')?.toString().trim()  ?? ''
  const email     = formData.get('email')?.toString().trim()     ?? ''
  const password  = formData.get('password')?.toString()         ?? ''

  const errors: RegisterFormState['errors'] = {}

  if (!firstName) errors.firstName = ['Nome é obrigatório.']
  if (!lastName)  errors.lastName  = ['Sobrenome é obrigatório.']

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

  // TODO: persistir usuário, redirecionar para próximo passo
  return { success: true, message: `Conta criada para ${email}!` }
}
