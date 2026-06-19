import Link from "next/link";

const footerLinks = [
  { label: "Privacidade", href: "#" },
  { label: "Termos", href: "#" },
  { label: "Ajuda", href: "#" },
  { label: "Vender", href: "#" },
];

export default function HomeFooter() {
  return (
    <footer className="bg-[#2D3277] px-4 lg:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <span className="text-[11px] text-white/60">© 2026 Mercado Livre — projeto de estudo</span>
      <nav className="flex gap-4" aria-label="Links institucionais">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[11px] text-white/60 hover:text-white/90 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
