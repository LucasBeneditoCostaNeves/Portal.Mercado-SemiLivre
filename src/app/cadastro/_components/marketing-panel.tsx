import { MercadoLivreLogo } from './mercadolivre-logo'

const FEATURES = [
  'Frete grátis em milhares de produtos',
  'Compra garantida e segura',
  'Parcelamento em até 12x sem juros',
] as const

export function MarketingPanel() {
  return (
    <div className="flex flex-col justify-between w-full h-full p-10 xl:p-14">
      <MercadoLivreLogo />

      <div className="space-y-5">
        <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
          Compre, venda e economize de verdade.
        </h2>
        <p className="text-gray-700 text-base leading-relaxed max-w-sm">
          Milhões de produtos com frete grátis, parcelamento sem juros e entrega rápida no conforto da sua casa.
        </p>
      </div>

      <ul className="space-y-4">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <FeatureIcon />
            <span className="text-gray-800 text-sm font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeatureIcon() {
  return (
    <div
      className="w-8 h-8 rounded-full bg-[#1a1f6e] flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <div className="w-3.5 h-3.5 border-2 border-white rounded-sm" />
    </div>
  )
}
