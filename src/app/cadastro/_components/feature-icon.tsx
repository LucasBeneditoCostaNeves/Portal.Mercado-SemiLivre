type FeatureIconProps = {
  size?: 'sm' | 'md'
}

export function FeatureIcon({ size = 'md' }: FeatureIconProps) {
  const outer = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  const inner = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
  return (
    <div
      className={`${outer} rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      <div className={`${inner} border-2 border-white rounded-sm`} />
    </div>
  )
}
