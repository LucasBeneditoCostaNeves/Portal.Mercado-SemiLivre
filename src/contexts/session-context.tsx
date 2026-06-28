'use client'

import { createContext, useContext } from 'react'

const SessionContext = createContext<string | null>(null)

export function SessionProvider({
  token,
  children,
}: {
  token: string | null
  children: React.ReactNode
}) {
  return <SessionContext.Provider value={token}>{children}</SessionContext.Provider>
}

export function useSession(): string | null {
  return useContext(SessionContext)
}
