'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Address } from '@/types/address'
import { AddressCard } from './address-card'
import { AddAddressModal } from './add-address-modal'
import { EditAddressModal } from './edit-address-modal'

type Props = {
  addresses: Address[]
  cartItemIds: string[]
}

export function AddressList({ addresses: initialAddresses, cartItemIds }: Props) {
  const router = useRouter()
  const defaultAddress = initialAddresses.find((a) => a.isDefault)
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [selectedId, setSelectedId] = useState<string | null>(defaultAddress?.id ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  function handleNewAddress(address: Address) {
    setAddresses((prev) => [...prev, address])
    setSelectedId(address.id)
    setModalOpen(false)
  }

  function handleEditedAddress(updated: Address) {
    setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    setEditingAddress(null)
  }

  function handleContinue() {
    if (!selectedId) return
    const params = new URLSearchParams()
    params.set('addressId', selectedId)
    if (cartItemIds.length > 0) params.set('itens', cartItemIds.join(','))
    router.push(`/checkout/pagamento?${params.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-white rounded-2xl border border-[var(--color-border)]">
            <i className="ti ti-map-pin-off text-4xl text-[var(--color-text-tertiary)]" aria-hidden="true" />
            <p className="text-[var(--color-text-secondary)] text-sm">
              Você ainda não tem endereços cadastrados.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-sm font-semibold text-[#2D3277] hover:underline"
            >
              Adicionar meu primeiro endereço
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selectedId === address.id}
              onSelect={setSelectedId}
              onEdit={setEditingAddress}
            />
          ))
        )}

        {addresses.length > 0 && (
          <div className="flex justify-center mt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] hover:opacity-80 transition-opacity"
            >
              <span className="w-6 h-6 rounded-full bg-[#FFE600] flex items-center justify-center">
                <i className="ti ti-plus text-xs text-[var(--color-brand-dark)]" aria-hidden="true" />
              </span>
              Adicionar novo endereço
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedId}
          className="w-full py-4 rounded-2xl bg-[#FFE600] text-[#1a1a1a] font-bold text-base hover:bg-[#f0d800] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuar
        </button>

        <a
          href="/carrinho"
          className="text-sm text-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
        >
          ← Voltar ao carrinho
        </a>
      </div>

      <AddAddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleNewAddress}
      />

      <EditAddressModal
        address={editingAddress}
        onClose={() => setEditingAddress(null)}
        onSuccess={handleEditedAddress}
      />
    </>
  )
}
