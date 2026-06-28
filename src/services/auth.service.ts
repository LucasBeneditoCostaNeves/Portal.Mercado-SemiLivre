import { apiClient } from '@/lib/http-client'

export type RegisterApiPayload = {
  name: string
  lastName: string
  email: string
  password: string
  status: boolean
  profileId: string
}

type LoginResponse = {
  acess_token: string
}

type RegisterResponse = {
  id: string
  name: string
  email: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export const authService = {
  login(email: string, password: string): Promise<LoginResponse> {
    return apiClient<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register(payload: RegisterApiPayload): Promise<RegisterResponse> {
    return apiClient<RegisterResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
