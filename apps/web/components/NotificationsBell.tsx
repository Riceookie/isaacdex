'use client'

import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import Link from 'next/link'
import Sprite, { type SpriteName } from '@/components/Sprite'
import { useZalogowany } from '@/components/KontoProvider'
import LinkGracza from '@/components/LinkGracza'

type Typ = 'follow' | 'wiadomosc'

type Notif = {
  id: string
  typ: Typ
  /** Kto to zrobił — osobno od treści, żeby dało się podlinkować profil. */
  autor: string
  /** Co zrobił — bez nicku na początku (ten dokleja LinkGracza). */
  tekst: string
  /** ISO z serwera; „ile temu" liczymy w przeglądarce (patrz `ileTemu`). */
  czas: string
}

// Sprite z gry na każdy typ powiadomienia — jedno źródło prawdy zamiast ifów w JSX.
const IKONA: Record<Typ, SpriteName> = {
  follow: 'friendfinder', // Friend Finder — ktoś Cię obserwuje
  wiadomosc: 'friends', // BFFS! — wiadomość prywatna
}

/** Kiedy ostatnio otwierałeś dzwonek — to preferencja tej przeglądarki, nie dane konta. */
const KLUCZ_WIDZIANE = 'idx_powiadomienia_widziane'

function ileTemu(iso: string): string {
  const minuty = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minuty < 1) return 'przed chwilą'
  if (minuty < 60) return `${minuty} min temu`
  const godziny = Math.round(minuty / 60)
  if (godziny < 24) return `${godziny} godz temu`
  const dni = Math.round(godziny / 24)
  return dni === 1 ? 'wczoraj' : `${dni} dni temu`
}

/**
 * Dzwonek z licznikiem nieprzeczytanych + rozwijana kartka powiadomień.
 * Licznik gaśnie po ZAMKNIĘCIU panelu, nie po otwarciu — dzięki temu przez cały czas
 * czytania widać, które wpisy są nowe (czerwony akcent).
 */
export default function NotificationsBell() {
  const zalogowany = useZalogowany()
  const [notyfikacje, setNotyfikacje] = useState<Notif[]>([])
  const [open, setOpen] = useState(false)
  const [zamyka, setZamyka] = useState(false)
  const [widziane, setWidziane] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)

  // Gość nie ma powiadomień — pusty dzwonek z zaproszeniem do logowania.
  useEffect(() => {
    if (!zalogowany) return
    setWidziane(Number(localStorage.getItem(KLUCZ_WIDZIANE) ?? 0))
    fetch('/api/powiadomienia', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { powiadomienia: [] }))
      .then((d) => setNotyfikacje(d.powiadomienia ?? []))
      .catch(() => setNotyfikacje([]))
  }, [zalogowany])

  // Nowe = zaszły po ostatnim otwarciu dzwonka w tej przeglądarce.
  const czyNowe = (n: Notif) => new Date(n.czas).getTime() > widziane
  const unread = notyfikacje.filter(czyNowe).length

  function otworz() {
    setZamyka(false)
    setOpen(true)
  }
  // Zamknięcie tylko odpala animację wyjścia; odmontowanie robi onAnimationEnd.
  function zamknij() {
    if (open && !zamyka) setZamyka(true)
  }

  // Zamknij po kliknięciu poza panelem albo Escape.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) zamknij()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && zamknij()
    window.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
    // `zamyka` w zależnościach: bez niego domknięcie trzymałoby nieaktualną wartość
    // i próbowałoby zamykać panel, który już się zamyka.
  }, [open, zamyka])

  /**
   * Koniec animacji WYJŚCIA → dopiero teraz znika panel i gaśnie licznik.
   * `target !== currentTarget` odsiewa animacje dzieci (kapiąca krew), które bąbelkują tutaj.
   */
  function onAnimEnd(e: AnimationEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || !zamyka) return
    setZamyka(false)
    setOpen(false)
    const teraz = Date.now()
    localStorage.setItem(KLUCZ_WIDZIANE, String(teraz))
    setWidziane(teraz)
  }

  return (
    <div className="notif" ref={ref}>
      <button
        className="util-icon"
        type="button"
        onClick={() => (open ? zamknij() : otworz())}
        aria-label="Powiadomienia"
        aria-expanded={open}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        >
          <path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" strokeLinecap="round" />
          <path d="M10 20a2 2 0 004 0" strokeLinecap="round" />
        </svg>
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div
          className={'notif-pop' + (zamyka ? ' notif-pop--zamyka' : '')}
          role="menu"
          onAnimationEnd={onAnimEnd}
        >
          <div className="notif-pop-head">
            <Sprite name="dadsnote" size={18} />
            Powiadomienia
            {unread > 0 && <span className="notif-head-licznik">{unread} nowe</span>}
          </div>

          {!zalogowany ? (
            <div className="notif-pop-foot">
              <span className="muted small">
                <Link href="/logowanie">Zaloguj się</Link>, aby dostawać powiadomienia.
              </span>
            </div>
          ) : (
            <>
              <ul className="notif-list">
                {notyfikacje.map((n) => (
                  <li
                    key={n.id}
                    className={'notif-item' + (czyNowe(n) ? ' notif-item--nowe' : '')}
                    role="menuitem"
                  >
                    <LinkGracza nick={n.autor} className="notif-ic-link">
                      <span className={'notif-ic notif-ic--' + n.typ}>
                        <Sprite name={IKONA[n.typ]} size={22} />
                      </span>
                    </LinkGracza>
                    <span className="notif-body">
                      <span className="notif-tekst">
                        <LinkGracza nick={n.autor}>
                          <b className="notif-autor">{n.autor}</b>
                        </LinkGracza>{' '}
                        {n.tekst}
                      </span>
                      <span className="notif-czas">{ileTemu(n.czas)}</span>
                    </span>
                    {czyNowe(n) && <span className="notif-kropka" aria-label="nowe" />}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
