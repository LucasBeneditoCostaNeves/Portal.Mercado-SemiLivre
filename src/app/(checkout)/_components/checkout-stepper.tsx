type Step = {
  label: string
  key: string
  icon: string
  doneIcon: string
}

const STEPS: Step[] = [
  { label: 'Carrinho', key: 'cart', icon: 'ti-shopping-cart', doneIcon: 'ti-check' },
  { label: 'Endereço', key: 'address', icon: 'ti-user', doneIcon: 'ti-check' },
  { label: 'Pagamento', key: 'payment', icon: 'ti-credit-card', doneIcon: 'ti-check' },
  { label: 'Confirmação', key: 'confirmation', icon: 'ti-circle-check', doneIcon: 'ti-check' },
]

type Props = {
  currentStep: 'cart' | 'address' | 'payment' | 'confirmation'
}

export function CheckoutStepper({ currentStep }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <nav aria-label="Etapas do checkout">
      <ol className="flex items-start">
        {STEPS.map((step, index) => {
          const isDone = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li key={step.key} className="flex items-start">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center text-base transition-colors',
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'bg-[var(--color-brand-dark)] text-[var(--color-brand)]'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400',
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <i
                    className={`ti ${isDone ? step.doneIcon : step.icon}`}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={[
                    'text-[11px] font-semibold whitespace-nowrap',
                    isDone
                      ? 'text-emerald-500'
                      : isActive
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-tertiary)]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={[
                    'h-0.5 w-14 sm:w-20 mt-5 mx-1 rounded-full transition-colors',
                    isDone ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
