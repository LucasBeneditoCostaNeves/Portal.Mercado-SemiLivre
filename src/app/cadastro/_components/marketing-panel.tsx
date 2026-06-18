import Image from 'next/image'

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
        width={260}
        height={87}
        priority
        style={{ height: 'auto' }}
        className="absolute top-10 left-10 xl:top-14 xl:left-0 rounded-xl"
      />

      <div className="h-[40px]" />

      {step === 2 ? <Step2Content /> : <Step1Content />}

      <p className="text-xs text-gray-500">
        Passo {step} de 3 — {step === 2 ? 'dados pessoais' : 'dados básicos'}
      </p>
    </div>
  )
}

function Step1Content() {
  return (
    <>
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
          Usamos seu CPF e data de nascimento apenas para verificar sua identidade. Suas informações são protegidas.
        </p>
      </div>

      <div className="flex gap-3 items-start bg-[#1a1f6e]/10 rounded-2xl p-4">
        <div className="w-9 h-9 rounded-full bg-[#1a1f6e] flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p className="text-sm text-[#1a1f6e] leading-relaxed">
          Seus dados são criptografados e nunca serão compartilhados com terceiros sem sua autorização.
        </p>
      </div>
    </>
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
