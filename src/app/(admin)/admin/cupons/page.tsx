import Link from 'next/link'
import { getSession } from '@/lib/session'
import { listCoupons } from '@/services/coupon.service'
import type { Coupon } from '@/types/coupon'

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatScope(coupon: Coupon) {
  if (coupon.scope === 'global') return 'Global'
  if (coupon.scope === 'seller') return `Seller ${coupon.sellerId}`
  return `Produto ${coupon.productId}`
}

export default async function AdminCuponsPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string; sellerId?: string }>
}) {
  const { scope, sellerId } = await searchParams
  const token = await getSession()

  let coupons: Coupon[] = []
  try {
    coupons = await listCoupons(
      {
        scope: scope as Coupon['scope'] | undefined,
        sellerId,
      },
      token!,
    )
  } catch {
    coupons = []
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Cupons — Admin</h1>
          <Link
            href="/admin/cupons/novo"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2D3277] text-white hover:opacity-90 transition-opacity"
          >
            + Novo Cupom
          </Link>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {(['', 'global', 'seller', 'product'] as const).map((s) => (
            <Link
              key={s}
              href={s ? `/admin/cupons?scope=${s}` : '/admin/cupons'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                (scope ?? '') === s
                  ? 'bg-[#2D3277] text-white border-[#2D3277]'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[#2D3277]'
              }`}
            >
              {s === '' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>

        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-xl border border-[var(--color-border)]">
            <i className="ti ti-ticket text-5xl text-[var(--color-text-tertiary)]" aria-hidden="true" />
            <p className="text-[var(--color-text-secondary)] text-sm">Nenhum cupom encontrado.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-tertiary)] text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold">Código</th>
                  <th className="text-left px-4 py-3 font-semibold">Desconto</th>
                  <th className="text-left px-4 py-3 font-semibold">Escopo</th>
                  <th className="text-left px-4 py-3 font-semibold">Criado por</th>
                  <th className="text-left px-4 py-3 font-semibold">Usos</th>
                  <th className="text-left px-4 py-3 font-semibold">Validade</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--color-text-primary)]">
                      {coupon.code}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-primary)]">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `R$ ${coupon.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatScope(coupon)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {coupon.createdByRole}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {formatDate(coupon.expiresAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          coupon.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {coupon.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/cupons/${coupon.id}`}
                        className="text-[#2D3277] hover:underline text-xs font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
