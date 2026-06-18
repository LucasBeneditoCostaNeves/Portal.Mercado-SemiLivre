import Image from 'next/image'

type MobileMarketingBannerProps = {
  step?: number
}

export function MobileMarketingBanner({ step = 1 }: MobileMarketingBannerProps) {
  return (
    <div className="bg-[#FFE600] px-6 pt-6 pb-8">
      <Image
        src="/logo-vertical-mercado-semilivre.png"
        alt="Mercado Semilivre"
        width={330}
        height={100}
        priority
        style={{ height: 'auto' }}
        className="mb-1 -ml-8"
      />
      {step === 2 ? (
        <>
          <h2 className="text-2xl font-bold text-[#1a1f6e] leading-snug mb-2 -mt-8 max-w-[270px]">
            Só mais alguns dados para proteger sua conta
          </h2>
          <p className="text-sm text-[#1a1f6e]">
            Suas informações são protegidas.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-[#1a1f6e] leading-snug mb-2 -mt-8 max-w-[270px]">
            Crie sua conta e compre com frete grátis
          </h2>
          <p className="text-sm text-[#1a1f6e]">
            Rápido, gratuito e sem complicação.
          </p>
        </>
      )}
    </div>
  )
}
