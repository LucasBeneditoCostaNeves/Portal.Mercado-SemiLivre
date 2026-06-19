import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[#FFE600] px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-mercadoSemilivre.png"
            alt="Mercado Semilivre"
            width={101}
            height={34}
            priority
            style={{ height: 'auto' }}
            className="xl:top-14 xl:left-0 rounded-xl"
          />
        </Link>

        <div className="flex items-center flex-1 min-w-[200px] bg-white rounded-lg overflow-hidden border border-yellow-300 order-3 lg:order-none w-full lg:w-auto">
          <input
            type="text"
            placeholder="Buscar produtos, marcas e muito mais…"
            className="flex-1 h-9 px-3 text-sm text-zinc-700 outline-none bg-transparent placeholder:text-zinc-400"
            aria-label="Buscar produtos"
          />
          <button
            className="h-9 px-3 bg-[#FFE600] border-l border-yellow-300 text-[#2D3277] hover:bg-yellow-400 transition-colors"
            aria-label="Buscar"
          >
            <i className="ti ti-search text-base" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex items-center gap-4 shrink-0 ml-auto lg:ml-0" aria-label="Ações do usuário">
          <Link href="/login" className="flex flex-col items-center gap-0.5 text-[#2D3277] hover:opacity-75 transition-opacity">
            <i className="ti ti-user text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Entrar</span>
          </Link>
          <Link href="#" className="flex flex-col items-center gap-0.5 text-[#2D3277] hover:opacity-75 transition-opacity">
            <i className="ti ti-package text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Pedidos</span>
          </Link>
          <Link href="#" className="relative flex flex-col items-center gap-0.5 text-[#2D3277] hover:opacity-75 transition-opacity">
            <i className="ti ti-shopping-cart text-lg" aria-hidden="true" />
            <span className="text-[10px] whitespace-nowrap">Carrinho</span>
            <span className="absolute -top-1 -right-2 bg-[#2D3277] text-[#FFE600] text-[9px] font-medium w-3.5 h-3.5 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
