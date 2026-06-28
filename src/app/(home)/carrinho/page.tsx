import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getCart } from '@/services/cart.service'
import Navbar from '../_components/navbar'
import { CartSelectionProvider } from './_components/cart-selection-context'
import { SelectAllCheckbox } from './_components/select-all-checkbox'
import { SellerGroup } from './_components/seller-group'
import { CartSummary } from './_components/cart-summary'

export default async function CartPage() {
  const token = await getSession()

  if (!token) {
    redirect('/login')
  }

  const cart = await getCart(token)

  const sellerGroups = cart.items.reduce<Record<string, { sellerId: string; items: typeof cart.items }>>(
    (acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = { sellerId: item.sellerId, items: [] }
      }
      acc[item.sellerId].items.push(item)
      return acc
    },
    {},
  )

  const allIds = cart.items.map((item) => item.id)

  return (
    <>
      <Navbar />
      <CartSelectionProvider initialIds={allIds}>
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Carrinho
            </h1>

            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-xl border border-[var(--color-border)]">
                <i className="ti ti-shopping-cart-off text-5xl text-[var(--color-text-tertiary)]" aria-hidden="true" />
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Seu carrinho está vazio.
                </p>
                <Link
                  href="/"
                  className="text-sm font-medium text-[#2D3277] hover:underline"
                >
                  Continuar comprando
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
                <div className="flex flex-col gap-3">
                  <SelectAllCheckbox allIds={allIds} />

                  {Object.values(sellerGroups).map(({ sellerId, items }) => (
                    <SellerGroup
                      key={sellerId}
                      sellerName={items[0].sellerName}
                      items={items}
                    />
                  ))}
                </div>

                <CartSummary items={cart.items} />
              </div>
            )}
          </main>
        </div>
      </CartSelectionProvider>
    </>
  )
}
