import Link from "next/link";

const categories = [
  "Ofertas do dia",
  "Supermercado",
  "Moda",
  "Eletrônicos",
  "Celulares",
  "Casa e jardim",
  "Esportes",
  "Automotivo",
  "Saúde e beleza",
  "Brinquedos",
];

export default function Subnav() {
  return (
    <nav
      className="bg-[#2D3277] px-4 lg:px-6 py-2 flex gap-6 overflow-x-auto scrollbar-none"
      aria-label="Navegação de categorias"
    >
      {categories.map((cat) => (
        <Link
          key={cat}
          href="#"
          className="text-white/85 text-xs whitespace-nowrap hover:text-white transition-colors"
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}
