export type RegisterFormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}

export type PersonalDataFormState = {
  errors?: {
    cpf?: string[]
    birthDate?: string[]
    phone?: string[]
    gender?: string[]
    cep?: string[]
    state?: string[]
    city?: string[]
    street?: string[]
    number?: string[]
  }
  success?: boolean
}

export type PreferencesFormState = {
  success?: boolean
  errors?: {
    categories?: string[]
  }
}

export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}
