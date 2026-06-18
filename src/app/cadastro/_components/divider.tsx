type DividerProps = {
  label: string
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <hr className="flex-1 border-zinc-700" />
      <span className="text-sm text-zinc-500 whitespace-nowrap">{label}</span>
      <hr className="flex-1 border-zinc-700" />
    </div>
  )
}
