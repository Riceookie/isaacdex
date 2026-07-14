'use client'

import { createContext, useContext, type ReactNode } from 'react'

/**
 * Czy ktoś jest zalogowany — jedna informacja, której potrzebuje wiele przycisków
 * (Obserwuj, lajk, wysyłka wiadomości). Kontekst zamiast propsa przepychanego przez
 * każdą stronę i kartę: to nie jest dana „o tej stronie", tylko o całej sesji.
 */
const Konto = createContext(false)

export function KontoProvider({
  zalogowany,
  children,
}: {
  zalogowany: boolean
  children: ReactNode
}) {
  return <Konto.Provider value={zalogowany}>{children}</Konto.Provider>
}

export const useZalogowany = () => useContext(Konto)
