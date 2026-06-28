import Link from 'next/link'

const categories = [
  'Ofertas do dia',
  'Supermercado',
  'Moda',
  'Eletrônicos',
  'Celulares',
  'Casa e jardim',
  'Esportes',
  'Automotivo',
  'Saúde e beleza',
  'Brinquedos',
]

export default function Subnav() {
  return (
    <nav
      className="bg-[var(--color-brand-dark)] px-6 lg:px-10 py-2 flex gap-6 overflow-x-auto scrollbar-none"
      aria-label="Navegação de categorias"
    >
      <div className="max-w-[1200px] m-auto">
        {categories.map((cat) => (
          <Link
            key={cat}
            href="#"
            className="text-white/85 text-xs whitespace-nowrap hover:text-white transition-colors m-5"
          >
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  )
}
