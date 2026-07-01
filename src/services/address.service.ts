import type { Address, CreateAddressPayload, UpdateAddressPayload } from '@/types/address'
import { authenticatedFetch } from './cart.service'

export async function getAddresses(token: string): Promise<Address[]> {
  return authenticatedFetch<Address[]>('/me/addresses', token, { cache: 'no-store' })
}

export async function createAddress(token: string, payload: CreateAddressPayload): Promise<Address> {
  return authenticatedFetch<Address>('/me/addresses', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateAddress(
  token: string,
  id: string,
  payload: UpdateAddressPayload,
): Promise<void> {
  await authenticatedFetch<unknown>(`/me/addresses/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
