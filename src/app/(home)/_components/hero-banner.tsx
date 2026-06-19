const stats = [
  { value: "+120k", label: "produtos em oferta" },
  { value: "12x", label: "sem juros" },
  { value: "48h", label: "entrega full" },
];

export default function HeroBanner() {
  return (
    <section className="bg-[#2D3277] rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 bg-[#FFE600] rounded-full px-3 py-1 w-fit">
          <i className="ti ti-bolt text-xs text-zinc-900" aria-hidden="true" />
          <span className="text-xs font-medium text-zinc-900">Semana do consumidor</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-medium text-white leading-snug">
          Até 60% off nos<br />melhores produtos
        </h2>
        <p className="text-sm text-white/75 leading-relaxed">
          Frete grátis em milhares de itens.<br />
          Parcele em até 12x sem juros.
        </p>
        <button className="bg-[#FFE600] text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-lg w-fit flex items-center gap-1.5 hover:bg-yellow-400 transition-colors">
          Ver todas as ofertas
          <i className="ti ti-arrow-right text-sm" aria-hidden="true" />
        </button>
      </div>

      <div className="flex gap-3 lg:gap-4 w-full lg:w-auto">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 lg:flex-none bg-white/10 rounded-lg px-4 py-3 text-center"
          >
            <p className="text-lg lg:text-xl font-medium text-[#FFE600]">{stat.value}</p>
            <span className="text-[11px] text-white/70">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
