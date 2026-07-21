'use client'

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

export type Pozycja = { left: number; top: number }

/**
 * Pozycja popovera przyklejonego do kotwicy — `position: fixed`, liczona ręcznie.
 *
 * Czat trzyma wiadomości w kontenerze z `overflow-y: auto`, więc popover renderowany
 * w środku byłby PRZYCINANY przy krawędziach. Stąd portal do `body` + fixed, a pozycję
 * musimy policzyć sami: nad kotwicą, a gdy nad nią brakuje miejsca — pod nią.
 *
 * Na koniec DOCISKAMY wynik do ekranu. Bez tego wysoki popover (naklejki: ~330 px)
 * odbity pod kotwicę wychodził dołem poza okno i ostatnie rzędy były nie do kliknięcia —
 * to nie jest przypadek teoretyczny, bo pole pisania stoi tuż nad dolną krawędzią.
 *
 * Liczone PO renderze (`useLayoutEffect`), bo potrzebujemy własnej wysokości popovera,
 * i przeliczane, gdy zmieni się `zaleznosci` (popover rośnie np. po wpisaniu frazy).
 */
export function usePozycjaPopovera(
  kotwica: HTMLElement | null,
  ref: RefObject<HTMLElement>,
  zaleznosci: unknown[] = [],
): Pozycja | null {
  const [poz, setPoz] = useState<Pozycja | null>(null)

  useLayoutEffect(() => {
    if (!kotwica || !ref.current) return
    const k = kotwica.getBoundingClientRect()
    const p = ref.current.getBoundingClientRect()
    const margines = 8
    // Więcej luzu od krawędzi okna, żeby wysoka wybieraczka (naklejki) nie kleiła się do brzegu
    // i nie sprawiała wrażenia ucinanej — siada wyraźnie wyżej nad polem pisania.
    const luz = 14
    const nadKotwica = k.top - p.height - margines
    const chciany = nadKotwica >= luz ? nadKotwica : k.bottom + margines
    // Docisk do okna: najpierw sufit dolnej krawędzi, potem górnej — kolejność ma znaczenie,
    // bo popover wyższy niż okno ma trafić w górę (widać początek listy), nie w dół.
    const top = Math.max(luz, Math.min(chciany, window.innerHeight - p.height - luz))
    const left = Math.max(luz, Math.min(k.right - p.width, window.innerWidth - p.width - luz))
    setPoz({ left, top })
    // Tablica zależności rośnie o `zaleznosci`, ale każdy wołający podaje je w stałej
    // liczbie, więc React dostaje listę tej samej długości między renderami.
  }, [kotwica, ref, ...zaleznosci])

  return poz
}

/** Zamknięcie popovera: klik poza nim (pomijając kotwicę) albo Escape. */
export function useZamykanie(
  kotwica: HTMLElement | null,
  ref: RefObject<HTMLElement>,
  onZamknij: () => void,
) {
  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node
      if (ref.current?.contains(t) || kotwica?.contains(t)) return
      onZamknij()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onZamknij()
    window.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [onZamknij, kotwica, ref])
}
