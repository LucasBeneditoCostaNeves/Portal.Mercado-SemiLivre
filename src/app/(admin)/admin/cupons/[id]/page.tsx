import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSession } from '@/lib/session'
import { listCoupons } from '@/services/coupon.service'
import { CouponForm } from '@/app/(fornecedor)/fornecedor/cupons/_components/coupon-form'
import { updateAdminCouponAction, deactivateAdminCouponAction } from '../actions'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminEditarCupomPage({ params }: Props) {
  const { id } = await params
  const token = await getSession()

  let coupon = null
  try {
    const coupons = await listCoupons({}, token!)
    coupon = coupons.find((c) => c.id === id) ?? null
  } catch {
    coupon = null
  }

  if (!coupon) notFound()

  const boundAction = updateAdminCouponAction.bind(null, id)
  const deactivateAction = deactivateAdminCouponAction.bind(null, id)

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/cupons"
            className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <i className="ti ti-arrow-left text-lg" aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            Editar Cupom — {coupon.code}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 flex flex-col gap-6">
          <CouponForm
            initialData={coupon}
            allowGlobalScope
            action={boundAction}
            submitLabel="Salvar Alterações"
          />

          {coupon.isActive && (
            <form action={deactivateAction}>
              <button
                type="submit"
                className="w-full py-3 rounded-xl border border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
              >
                Desativar Cupom
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
