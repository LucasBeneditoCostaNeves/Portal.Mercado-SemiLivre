import Link from 'next/link'

type Props = {
  title: string
  href?: string
  linkLabel?: string
}

export default function SectionHeader({
  title,
  href = '#',
  linkLabel = 'Ver todos',
}: Props) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-base font-medium text-[var(--color-text-primary)]">
        {title}
      </h3>
      <Link
        href={href}
        className="text-xs text-[#FFE600] hover:underline flex items-center gap-1"
      >
        {linkLabel}
        <i className="ti ti-arrow-right text-[11px]" aria-hidden="true" />
      </Link>
    </div>
  )
}
