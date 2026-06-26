import { FeatureIcon } from './feature-icon'

const FEATURES = [
  { label: 'Frete grátis' },
  { label: 'Compra segura' },
  { label: '12x sem juros' },
] as const

export function MobileFeatureRow() {
  return (
    <div className="grid grid-cols-3 divide-x divide-[var(--color-border)] mt-4">
      {FEATURES.map(({ label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 px-2">
          <FeatureIcon size="sm" />
          <span className="text-xs text-[var(--color-text-secondary)] text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}
