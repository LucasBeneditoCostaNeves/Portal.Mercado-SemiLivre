import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getAddresses } from '@/services/address.service'
import { CheckoutStepper } from '@/app/(checkout)/_components/checkout-stepper'
import { AddressList } from './_components/address-list'

type Props = {
  searchParams: Promise<{ itens?: string }>
}

export default async function CheckoutAddressPage({ searchParams }: Props) {
  const token = await getSession()
  if (!token) redirect('/login')

  const { itens } = await searchParams
  const cartItemIds = itens ? itens.split(',').filter(Boolean) : []

  const addresses = await getAddresses(token)

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
      <div className="flex justify-center">
        <CheckoutStepper currentStep="address" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
          Endereço de entrega
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Selecione onde você quer receber o pedido.
        </p>
      </div>

      <AddressList addresses={addresses} cartItemIds={cartItemIds} />
    </main>
  )
}
