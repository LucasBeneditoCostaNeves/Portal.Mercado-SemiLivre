export type Address = {
  id: string
  cep: string
  street: string
  number: string
  complement?: string | null
  neighborhood?: string
  city: string
  state: string
  isDefault: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreateAddressPayload = {
  cep: string
  street: string
  number: string
  complement?: string | null
  city: string
  state: string
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>
