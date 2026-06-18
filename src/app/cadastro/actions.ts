'use server'

import type { PersonalDataFormState, PreferencesFormState, RegisterFormState } from '@/domain/auth/types'

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

const VALID_GENDERS = ['masculino', 'feminino', 'nao-binario', 'prefiro-nao-informar']
const VALID_STATES = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

function isValidCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i)
  let r = 11 - (sum % 11)
  if (r >= 10) r = 0
  if (r !== parseInt(d[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i)
  r = 11 - (sum % 11)
  if (r >= 10) r = 0
  return r === parseInt(d[10])
}

function isAdult(birthDate: string): boolean {
  const parts = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!parts) return false
  const [, day, month, year] = parts
  const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  if (isNaN(birth.getTime())) return false
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()
  return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
}

export async function savePersonalData(
  _prevState: PersonalDataFormState,
  formData: FormData,
): Promise<PersonalDataFormState> {
  const cpf       = formData.get('cpf')?.toString().trim()       ?? ''
  const birthDate = formData.get('birthDate')?.toString().trim() ?? ''
  const phone     = formData.get('phone')?.toString().trim()     ?? ''
  const gender    = formData.get('gender')?.toString().trim()    ?? ''
  const cep       = formData.get('cep')?.toString().trim()       ?? ''
  const state     = formData.get('state')?.toString().trim()     ?? ''
  const city      = formData.get('city')?.toString().trim()      ?? ''
  const street    = formData.get('street')?.toString().trim()    ?? ''
  const number    = formData.get('number')?.toString().trim()    ?? ''

  const errors: PersonalDataFormState['errors'] = {}

  if (!cpf) {
    errors.cpf = ['CPF é obrigatório.']
  } else if (!isValidCpf(cpf)) {
    errors.cpf = ['CPF inválido.']
  }

  if (!birthDate) {
    errors.birthDate = ['Data de nascimento é obrigatória.']
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    errors.birthDate = ['Use o formato DD/MM/AAAA.']
  } else if (!isAdult(birthDate)) {
    errors.birthDate = ['Você deve ter pelo menos 18 anos.']
  }

  if (!phone) {
    errors.phone = ['Telefone é obrigatório.']
  } else if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone)) {
    errors.phone = ['Digite um telefone válido. Ex: (11) 99999-9999']
  }

  if (!gender || !VALID_GENDERS.includes(gender)) {
    errors.gender = ['Selecione um gênero.']
  }

  if (!cep) {
    errors.cep = ['CEP é obrigatório.']
  } else if (!/^\d{5}-\d{3}$/.test(cep)) {
    errors.cep = ['CEP inválido. Use o formato 00000-000.']
  }

  if (!state || !VALID_STATES.includes(state)) {
    errors.state = ['Selecione um estado.']
  }

  if (!city)   errors.city   = ['Cidade é obrigatória.']
  if (!street) errors.street = ['Logradouro é obrigatório.']
  if (!number) errors.number = ['Número é obrigatório.']

  if (Object.keys(errors).length > 0) return { errors }

  // TODO: persistir dados pessoais e avançar para passo 3
  return { success: true }
}

export async function savePreferences(
  _prevState: PreferencesFormState,
  formData: FormData,
): Promise<PreferencesFormState> {
  const categories = formData.getAll('categories').map((v) => v.toString())
  // accepts empty array (skip is valid)
  if (!Array.isArray(categories)) {
    return { errors: { categories: ['Formato inválido.'] } }
  }
  // TODO: persistir preferências
  return { success: true }
}
