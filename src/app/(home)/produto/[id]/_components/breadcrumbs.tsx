import Link from 'next/link'

type Props = {
  category: string
  productTitle: string
}

const MAX_TITLE_LENGTH = 40

export default function Breadcrumbs({ category, productTitle }: Props) {
  const truncatedTitle =
    productTitle.length > MAX_TITLE_LENGTH
      ? `${productTitle.slice(0, MAX_TITLE_LENGTH)}…`
      : productTitle

  return (
    <nav
      aria-label="Navegação estrutural"
      className="flex items-center gap-2 flex-wrap"
    >
      <Link
        href="/"
        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        Início
      </Link>
      <i
        className="ti ti-chevron-right text-xs text-[var(--color-text-tertiary)]"
        aria-hidden="true"
      />
      <span className="text-xs text-[var(--color-text-secondary)]">
        {category}
      </span>
      <i
        className="ti ti-chevron-right text-xs text-[var(--color-text-tertiary)]"
        aria-hidden="true"
      />
      <span className="text-xs text-[var(--color-text-primary)]">
        {truncatedTitle}
      </span>
    </nav>
  )
}
