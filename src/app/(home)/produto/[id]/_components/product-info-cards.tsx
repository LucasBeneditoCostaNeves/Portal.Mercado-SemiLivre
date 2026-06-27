type Props = {
  warrantyInformation: string;
};

type InfoCard = {
  icon: string;
  title: string;
  description: string;
};

export default function ProductInfoCards({ warrantyInformation }: Props) {
  const cards: InfoCard[] = [
    {
      icon: "ti-shield-check",
      title: "Garantia",
      description: warrantyInformation,
    },
    {
      icon: "ti-refresh",
      title: "Devolução grátis",
      description: "Você tem 30 dias desde que recebeu",
    },
    {
      icon: "ti-lock",
      title: "Compra segura",
      description: "Seus dados estão protegidos",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="border border-[var(--color-border)] rounded-lg p-3 flex flex-col gap-2"
        >
          <div className="inline-flex items-center justify-center w-7 h-7 bg-[var(--color-bg-secondary)] rounded-md">
            <i className={`ti ${card.icon} text-base text-[var(--color-text-secondary)]`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-text-primary)]">{card.title}</p>
            <span className="text-[11px] text-[var(--color-text-secondary)]">{card.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
