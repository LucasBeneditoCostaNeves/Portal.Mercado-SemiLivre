import Link from 'next/link'
import { CouponForm } from '@/app/(fornecedor)/fornecedor/cupons/_components/coupon-form'
import { createAdminCouponAction } from '../actions'

export default function AdminNovoCupomPage() {
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
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Novo Cupom</h1>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <CouponForm
            allowGlobalScope
            action={createAdminCouponAction}
            submitLabel="Criar Cupom"
          />
        </div>
      </main>
    </div>
  )
}
