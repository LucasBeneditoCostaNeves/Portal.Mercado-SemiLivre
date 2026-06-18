import Image from 'next/image'

export function MobileMarketingBanner() {
  return (
    <div className="bg-[#FFE600] px-6 pt-10 pb-14">
      <Image
        src="/logo-mercadoSemilivre.png"
        alt="Mercado Semilivre"
        width={110}
        height={74}
        priority
        style={{ height: 'auto' }}
        className="rounded-xl mb-6"
      />
      <h2 className="text-2xl font-bold text-[#1a1f6e] leading-snug mb-2">
        Crie sua conta e compre com frete grátis
      </h2>
      <p className="text-sm text-[#1a1f6e]">
        Rápido, gratuito e sem complicação.
      </p>
    </div>
  )
}
