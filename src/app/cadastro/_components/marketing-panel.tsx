import Image from 'next/image'
import { FeatureIcon } from './feature-icon'

type MarketingPanelProps = {
  step?: number
}

const FEATURES = [
  'Frete grátis em milhares de produtos',
  'Compra garantida e segura',
  'Parcelamento em até 12x sem juros',
] as const

export function MarketingPanel({ step = 1 }: MarketingPanelProps) {
  return (
    <div className="relative flex flex-col justify-between w-full h-full p-10 xl:p-14">
      <Image
        src="/logo-mercadoSemilivre.png"
        alt="Mercado Semilivre"
        width={173}
        height={58}
        priority
        style={{ height: 'auto' }}
        className="absolute top-10 left-10 xl:top-14 xl:left-0 rounded-xl"
      />

      <div className="h-[40px]" />

      {step === 3 ? (
        <Step3Content />
      ) : step === 2 ? (
        <Step2Content />
      ) : (
        <Step1Content />
      )}

      <p className="text-xs text-gray-500">
        Passo {step} de 3 —{' '}
        {step === 3
          ? 'preferências'
          : step === 2
            ? 'dados pessoais'
            : 'dados básicos'}
      </p>
    </div>
  )
}

function Step1Content() {
  return (
    <>
      <div className="space-y-5">
        <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mt-5">
          Compre, venda e economize de verdade.
        </h2>
        <p className="text-gray-700 text-base leading-relaxed max-w-sm">
          Milhões de produtos com frete grátis, parcelamento sem juros e entrega
          rápida no conforto da sua casa.
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
    </>
  )
}

function Step2Content() {
  return (
    <>
      <div className="space-y-5">
        <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
          Só mais alguns dados para proteger sua conta.
        </h2>
        <p className="text-gray-700 text-base leading-relaxed max-w-sm">
          Usamos seu CPF e data de nascimento apenas para verificar sua
          identidade. Suas informações são protegidas.
        </p>
      </div>

      <div className="flex gap-3 items-start bg-[var(--color-brand-dark)]/10 rounded-2xl p-4">
        <div
          className="w-9 h-9 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-sm text-[var(--color-brand-dark)] leading-relaxed">
          Seus dados são criptografados e nunca serão compartilhados com
          terceiros sem sua autorização.
        </p>
      </div>
    </>
  )
}

const STEP3_CHECKLIST = [
  { label: 'Dados básicos', done: true },
  { label: 'Dados pessoais', done: true },
  { label: 'Preferências', done: false },
] as const

function Step3Content() {
  return (
    <>
      <div className="space-y-5">
        <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mt-35">
          Você está quase lá! Personalize sua experiência.
        </h2>
        <p className="text-gray-700 text-base leading-relaxed max-w-sm">
          Escolha suas categorias favoritas e receba ofertas e recomendações
          personalizadas.
        </p>
      </div>

      <ul className="space-y-3">
        {STEP3_CHECKLIST.map(({ label, done }) => (
          <li key={label} className="flex items-center gap-3">
            <div
              className={[
                'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                done
                  ? 'bg-[var(--color-brand-dark)]'
                  : 'border-2 border-[var(--color-brand-dark)]',
              ].join(' ')}
              aria-hidden="true"
            >
              {done && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-[var(--color-brand-dark)] font-semibold'}`}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
