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
