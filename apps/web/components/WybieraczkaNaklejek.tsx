'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'
import KatalogNaklejek from '@/components/KatalogNaklejek'
import { usePozycjaPopovera, useZamykanie } from '@/lib/popover'

/**
 * Wybieraczka naklejek: komplet itemów, trinketów i pickupów z gry.
 *
 * Osobny komponent od `WybieraczkaReakcji`, bo naklejka trafia w TREŚĆ wiadomości (token
 * `:c105:`), a reakcja pod wiadomość — inny cel, inny stan. Wspólna jest sama przeglądarka
 * katalogu (`KatalogNaklejek`) i obsługa popovera (`lib/popover`).
 */
export default function WybieraczkaNaklejek({
  kotwica,
  onWybierz,
  onZamknij,
}: {
  kotwica: HTMLElement | null
  /** Dostaje token naklejki (`:c105:` wstawi wołający). */
  onWybierz: (id: string) => void
  onZamknij: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Rozmiar popovera nie zmienia się z listą (siatka ma stałą wysokość i własny scroll),
  // więc pozycję liczymy raz — bez zależności od frazy.
  const poz = usePozycjaPopovera(kotwica, ref)
  useZamykanie(kotwica, ref, onZamknij)

  return createPortal(
    <div
      className="cz-picker pelna cz-naklejki"
      ref={ref}
      role="menu"
      aria-label="Naklejki"
      style={poz ? { left: poz.left, top: poz.top } : { opacity: 0, pointerEvents: 'none' }}
    >
      <KatalogNaklejek etykieta="Naklejka" onWybierz={onWybierz} />
    </div>,
    document.body,
  )
}
