'use client'

import { useCartSelection } from './cart-selection-context'

type Props = {
  allIds: string[]
}

export function SelectAllCheckbox({ allIds }: Props) {
  const { allSelected, selectAll, clearAll } = useCartSelection()
  const checked = allSelected(allIds)

  function handleChange() {
    if (checked) {
      clearAll()
    } else {
      selectAll(allIds)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] px-4 py-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="w-4 h-4 accent-[#2D3277] cursor-pointer shrink-0"
        />
        <span className="text-sm text-[var(--color-text-primary)]">
          Todos os produtos ({allIds.length})
        </span>
      </label>
    </div>
  )
}
