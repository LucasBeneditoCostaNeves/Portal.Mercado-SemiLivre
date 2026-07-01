'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { createAddress, updateAddress } from '@/services/address.service'
import type { Address, CreateAddressPayload, UpdateAddressPayload } from '@/types/address'

type CreateResult = { success: true; address: Address } | { success: false; error: string }
type UpdateResult = { success: true } | { success: false; error: string }

export async function createAddressAction(payload: CreateAddressPayload): Promise<CreateResult> {
  const token = await getSession()
  if (!token) return { success: false, error: 'Não autenticado' }

  try {
    const address = await createAddress(token, payload)
    revalidatePath('/checkout/endereco')
    return { success: true, address }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Erro ao salvar endereço' }
  }
}

export async function updateAddressAction(
  id: string,
  payload: UpdateAddressPayload,
): Promise<UpdateResult> {
  const token = await getSession()
  if (!token) return { success: false, error: 'Não autenticado' }

  try {
    await updateAddress(token, id, payload)
    revalidatePath('/checkout/endereco')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro ao atualizar endereço',
    }
  }
}
