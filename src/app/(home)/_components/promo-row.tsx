const promoCards = [
  {
    id: "mercado-pago",
    variant: "yellow" as const,
    icons: ["ti-shield-check", "ti-credit-card"],
    title: "Mercado Pago",
    description:
      "Pague com segurança, parcelado em até 12x sem juros e com proteção total nas suas compras.",
    cta: "Conhecer",
  },
  {
    id: "entrega-full",
    variant: "blue" as const,
    icons: ["ti-truck-delivery", "ti-clock"],
    title: "Entrega Full",
    description:
      "Produtos com o selo Full chegam em até 24h diretamente dos nossos centros de distribuição.",
    cta: "Ver produtos Full",
  },
];

const variantStyles = {
  yellow: {
    card: "bg-[#FFE600]",
    title: "text-zinc-900",
    description: "text-zinc-700",
    iconWrapper: "bg-[#2D3277]/10",
    icon: "text-[#2D3277]",
    btn: "bg-[#2D3277] text-[#FFE600]",
  },
  blue: {
    card: "bg-[#2D3277]",
    title: "text-white",
    description: "text-white/75",
    iconWrapper: "bg-white/15",
    icon: "text-[#FFE600]",
    btn: "bg-[#FFE600] text-zinc-900",
  },
};

export default function PromoRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {promoCards.map((card) => {
        const styles = variantStyles[card.variant];
        return (
          <div key={card.id} className={`${styles.card} rounded-xl p-5 flex flex-col gap-3`}>
            <div className="flex gap-2">
              {card.icons.map((icon) => (
                <div
                  key={icon}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.iconWrapper}`}
                >
                  <i className={`ti ${icon} text-base ${styles.icon}`} aria-hidden="true" />
                </div>
              ))}
            </div>
            <h3 className={`text-base font-medium ${styles.title}`}>{card.title}</h3>
            <p className={`text-xs leading-relaxed ${styles.description}`}>{card.description}</p>
            <button
              className={`${styles.btn} text-xs font-medium px-4 py-2 rounded-lg w-fit flex items-center gap-1.5 hover:opacity-90 transition-opacity`}
            >
              {card.cta}
              <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
