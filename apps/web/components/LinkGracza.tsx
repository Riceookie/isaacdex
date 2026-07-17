'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import KartaHover, { OPOZNIENIE } from '@/components/KartaHover'

/**
 * Dokąd prowadzi klik w gracza. Własny nick leci na /profil (tam jest edycja i Steam),
 * cudzy na /gracz/[nick].
 *
 * NIE /profil/[nick] — ta trasa jest już zajęta przez profil POSTACI z gry (Isaac, Azazel),
 * więc gracz o nicku „Isaac" przykryłby stronę postaci.
 */
export function hrefGracza(nick: string, ja = false): string {
  return ja ? '/profil' : `/gracz/${encodeURIComponent(nick)}`
}

/**
 * Nick albo avatar jako klikalne wejście na profil gracza — jedno miejsce, w którym
 * zapada decyzja „linkować czy nie", używane w feedzie, na czacie, w powiadomieniach
 * i na listach znajomych.
 *
 * Bez linku (zwykły <span>) gdy nie ma dokąd iść: bot Dogma na czacie albo nick, którego
 * nie ma w bazie (czat jest DEMO — nicki to stringi, nie klucze obce). Lepszy martwy tekst
 * niż link prowadzący w 404.
 *
 * Najazd myszą (po chwili) pokazuje mini-profil — patrz KartaHover.
 */
export default function LinkGracza({
  nick,
  ja = false,
  brak = false,
  dymek = true,
  className,
  children,
}: {
  nick: string | null | undefined
  /** To Ty — link idzie na /profil zamiast /gracz/[nick]. */
  ja?: boolean
  /** Nick bez konta w bazie (bot, gość demo) — nie linkujemy donikąd. */
  brak?: boolean
  /** Wyłącza dymek tam, gdzie by przeszkadzał (np. w samym dymku albo na liście w modalu). */
  dymek?: boolean
  className?: string
  children: ReactNode
}) {
  const [hover, setHover] = useState(false)
  const kotwica = useRef<HTMLAnchorElement>(null)
  const zegar = useRef<ReturnType<typeof setTimeout> | null>(null)

  const anuluj = useCallback(() => {
    if (zegar.current) clearTimeout(zegar.current)
    zegar.current = null
  }, [])

  // Zegar musi zniknąć razem z komponentem — inaczej dymek próbuje się otworzyć
  // po odmontowaniu (np. gdy feed przeładuje się pod kursorem).
  useEffect(() => anuluj, [anuluj])

  const klasy = className ? className + ' ' : ''
  if (!nick || brak) return <span className={className}>{children}</span>

  /**
   * Dymek TYLKO dla myszy. Na dotyku „pointerenter" leci przy pierwszym tapnięciu, więc
   * dymek zasłoniłby link, w który użytkownik właśnie celuje.
   */
  const wjazd = (e: React.PointerEvent) => {
    if (!dymek || e.pointerType !== 'mouse') return
    anuluj()
    zegar.current = setTimeout(() => setHover(true), OPOZNIENIE)
  }
  const wyjazd = () => {
    anuluj()
    setHover(false)
  }

  return (
    <>
      <Link
        ref={kotwica}
        href={hrefGracza(nick, ja)}
        className={klasy + 'gracz-link'}
        title={ja ? 'Twój profil' : `Profil gracza ${nick}`}
        prefetch={false}
        onPointerEnter={wjazd}
        onPointerLeave={wyjazd}
        // Klik i tak nawiguje — dymek nie ma po co zostawać.
        onClick={wyjazd}
      >
        {children}
      </Link>
      {hover && kotwica.current && (
        <KartaHover nick={nick} kotwica={kotwica.current} onZamknij={() => setHover(false)} />
      )}
    </>
  )
}
