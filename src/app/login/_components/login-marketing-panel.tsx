import Image from 'next/image'

const STATS = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Seus pedidos te esperam',
    subtitle: 'Acompanhe entregas em tempo real',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Lista de favoritos salva',
    subtitle: 'Produtos que você curtiu estão guardados',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    title: 'Ofertas exclusivas para você',
    subtitle: 'Descontos personalizados no seu perfil',
  },
] as const

export function LoginMarketingPanel() {
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

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="xl:text-5xl font-bold text-gray-900 leading-tight mt-35">
            Bem-vindo de volta!
          </h2>
          <p className="mt-3 text-[#3a3a5c] text-sm leading-relaxed max-w-xs">
            Entre na sua conta e continue aproveitando as melhores ofertas com
            frete grátis e entrega rápida.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {STATS.map(({ icon, title, subtitle }) => (
            <li key={title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#2D3277]/10 flex items-center justify-center shrink-0 text-[#2D3277]">
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a1a2e]">{title}</p>
                <span className="text-xs text-[#3a3a5c]">{subtitle}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-[#3a3a5c]">Acesso seguro e criptografado</p>
    </div>
  )
}
