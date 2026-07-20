'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { JEZYK_DOMYSLNY, type Jezyk } from '@/lib/i18n/jezyk'
import { zrobTlumacza, type Tlumacz } from '@/lib/i18n/slownik'

/**
 * Język dla komponentów klienckich.
 *
 * Wartość podaje SERWER (layout czyta ciasteczko i wstawia ją w provider), a nie sam
 * klient z `document.cookie` — inaczej pierwszy render na kliencie leciałby domyślnym
 * językiem i React zgłosiłby hydration mismatch przy każdym przetłumaczonym napisie.
 */
const Kontekst = createContext<{ jezyk: Jezyk; t: Tlumacz }>({
  jezyk: JEZYK_DOMYSLNY,
  t: zrobTlumacza(JEZYK_DOMYSLNY),
})

export default function JezykProvider({ jezyk, children }: { jezyk: Jezyk; children: ReactNode }) {
  const wartosc = useMemo(() => ({ jezyk, t: zrobTlumacza(jezyk) }), [jezyk])
  return <Kontekst.Provider value={wartosc}>{children}</Kontekst.Provider>
}

/** `const t = useT()` — tłumacz w komponencie klienckim. */
export function useT(): Tlumacz {
  return useContext(Kontekst).t
}

/** Sam kod języka — do `Intl`, dat i innych miejsc, które potrzebują locale. */
export function useJezyk(): Jezyk {
  return useContext(Kontekst).jezyk
}
