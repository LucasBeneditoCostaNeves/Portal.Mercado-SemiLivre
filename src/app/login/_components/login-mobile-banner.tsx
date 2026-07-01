import Image from 'next/image'

export function LoginMobileBanner() {
  return (
    <div className="bg-[var(--color-brand)] px-6 pt-0 pb-8 lg:hidden">
      <Image
        src="/logo-vertical-mercado-semilivre.png"
        alt="Mercado Semilivre"
        width={220}
        height={100}
        priority
        style={{ height: 'auto' }}
        className="mb-1 -ml-8"
      />
      <h2 className="text-2xl font-bold text-[#1a1f6e] leading-snug mb-2 max-w-[270px]">
        Bem-vindo de volta!
      </h2>
      <p className="text-sm text-[#1a1f6e]">
        Entre na sua conta e aproveite as melhores ofertas.
      </p>
    </div>
  )
}
