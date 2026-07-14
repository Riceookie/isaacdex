'use client'

import { useOptimistic, useTransition } from 'react'
import { przelaczObserwowanie } from '@/app/actions/social'

/**
 * Obserwuj / Odwzajemnij / Znajomi / Obserwujesz — zapisuje się w bazie, UI reaguje od razu
 * (useOptimistic), więc klik jest natychmiastowy mimo round-tripu do serwera.
 *
 * Przycisk pokazuje stan RELACJI, nie samą akcję:
 *  - on obserwuje mnie, ja jego nie → „Odwzajemnij" (jeden klik dzieli od znajomości)
 *  - obie strony                    → „Znajomi" (hover: „Usuń znajomego")
 *  - tylko ja obserwuję             → „Obserwujesz" (hover: „Przestań")
 *  - nikt nikogo                    → „Obserwuj"
 */
export default function PrzyciskObserwuj({
  graczId,
  obserwowany,
  obserwujeMnie = false,
  pelna = false,
}: {
  graczId: number
  obserwowany: boolean
  obserwujeMnie?: boolean
  /** Na całą szerokość — karty w „Odkryj graczy". */
  pelna?: boolean
}) {
  const [czekam, start] = useTransition()
  const [stan, przelacz] = useOptimistic(obserwowany, (s: boolean) => !s)

  const znajomy = stan && obserwujeMnie
  const etykieta = znajomy
    ? 'Znajomi'
    : stan
      ? 'Obserwujesz'
      : obserwujeMnie
        ? 'Odwzajemnij'
        : 'Obserwuj'

  const klasy = [
    'obs-btn',
    stan ? 'on' : '',
    znajomy ? 'znajomy' : '',
    !stan && obserwujeMnie ? 'odwzajemnij' : '',
    pelna ? 'pelna' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={klasy}
      disabled={czekam}
      aria-pressed={stan}
      onClick={() =>
        start(async () => {
          przelacz(undefined)
          await przelaczObserwowanie(graczId)
        })
      }
    >
      {/* Dwie etykiety w jednej komórce gridu: hover podmienia widoczną bez skoku szerokości. */}
      <span className="obs-txt">{etykieta}</span>
      {stan && <span className="obs-txt-hover">{znajomy ? 'Usuń znajomego' : 'Przestań'}</span>}
    </button>
  )
}
