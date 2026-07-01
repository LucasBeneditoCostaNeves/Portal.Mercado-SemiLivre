import Link from 'next/link'
import { getSession } from '@/lib/session'
import { decodeJwt } from '@/lib/jwt'
import { listCoupons } from '@/services/coupon.service'
import type { Coupon } from '@/types/coupon'

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatScope(coupon: Coupon) {
  if (coupon.scope === 'product') return `Produto ${coupon.productId}`
  return 'Todos os meus produtos'
}

export default async function FornecedorCuponsPage() {
  const token = await getSession()
  const payload = decodeJwt(token!)
  const sellerId = payload?.sellerId as string | undefined

  let coupons: Coupon[] = []
  try {
    coupons = await listCoupons({ sellerId }, token!)
  } catch {
    coupons = []
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Meus Cupons</h1>
          <Link
            href="/fornecedor/cupons/novo"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2D3277] text-white hover:opacity-90 transition-opacity"
          >
            + Novo Cupom
          </Link>
        </div>

        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-xl border border-[var(--color-border)]">
            <i className="ti ti-ticket text-5xl text-[var(--color-text-tertiary)]" aria-hidden="true" />
            <p className="text-[var(--color-text-secondary)] text-sm">
              Você ainda não criou nenhum cupom.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-tertiary)] text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold">Código</th>
                  <th className="text-left px-4 py-3 font-semibold">Desconto</th>
                  <th className="text-left px-4 py-3 font-semibold">Escopo</th>
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
                        href={`/fornecedor/cupons/${coupon.id}`}
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
