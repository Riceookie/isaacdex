'use client'

import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { przelaczObserwowanie } from '@/app/actions/social'
import { useZalogowany } from '@/components/KontoProvider'
import { powiedz } from '@/lib/companionGlos'
import { useT } from '@/components/JezykProvider'

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
  const t = useT()
  const zalogowany = useZalogowany()
  const [czekam, start] = useTransition()
  const [stan, przelacz] = useOptimistic(obserwowany, (s: boolean) => !s)

  // Gość nie ma czym obserwować. Zamiast przycisku, który nic nie robi (a tak było, gdy
  // zapis szedł na konto właściciela) — jawne zaproszenie do logowania.
  if (!zalogowany) {
    return (
      <Link href="/logowanie" className={'obs-btn' + (pelna ? ' pelna' : '')}>
        <span className="obs-txt">{t('wspolne.zaloguj')}</span>
      </Link>
    )
  }

  const znajomy = stan && obserwujeMnie
  const etykieta = znajomy
    ? t('profil.obsZnajomi')
    : stan
      ? t('profil.obsObserwujesz')
      : obserwujeMnie
        ? t('profil.obsOdwzajemnij')
        : t('profil.obsObserwuj')

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
          // Reakcja maskotki na akcję usera: obserwacja = radość, odklik = neutralnie.
          powiedz(stan ? t('profil.glosOdklik') : t('profil.glosObserwuj'), stan ? 'sad' : 'happy')
          przelacz(undefined)
          await przelaczObserwowanie(graczId)
        })
      }
    >
      {/* Dwie etykiety w jednej komórce gridu: hover podmienia widoczną bez skoku szerokości. */}
      <span className="obs-txt">{etykieta}</span>
      {stan && (
        <span className="obs-txt-hover">
          {znajomy ? t('profil.obsUsunZnajomego') : t('profil.obsPrzestan')}
        </span>
      )}
    </button>
  )
}
