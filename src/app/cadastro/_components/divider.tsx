type DividerProps = {
  label: string
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <hr className="flex-1 border-[var(--color-border)]" />
      <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">{label}</span>
      <hr className="flex-1 border-[var(--color-border)]" />
    </div>
  )
}
