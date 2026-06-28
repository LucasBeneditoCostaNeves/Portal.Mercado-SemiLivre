'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type CartSelectionContextValue = {
  selectedIds: Set<string>
  toggleItem: (id: string) => void
  selectAll: (ids: string[]) => void
  clearAll: () => void
  isSelected: (id: string) => boolean
  allSelected: (ids: string[]) => boolean
}

const CartSelectionContext = createContext<CartSelectionContextValue | null>(null)

export function CartSelectionProvider({
  children,
  initialIds,
}: {
  children: React.ReactNode
  initialIds: string[]
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialIds),
  )

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  )

  const allSelected = useCallback(
    (ids: string[]) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    [selectedIds],
  )

  const value = useMemo(
    () => ({ selectedIds, toggleItem, selectAll, clearAll, isSelected, allSelected }),
    [selectedIds, toggleItem, selectAll, clearAll, isSelected, allSelected],
  )

  return (
    <CartSelectionContext.Provider value={value}>
      {children}
    </CartSelectionContext.Provider>
  )
}

export function useCartSelection() {
  const ctx = useContext(CartSelectionContext)
  if (!ctx) throw new Error('useCartSelection must be used within CartSelectionProvider')
  return ctx
}
