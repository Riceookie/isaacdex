'use client'

import { useEffect, useRef, useState, type AnimationEvent } from 'react'
import Link from 'next/link'
import Sprite, { type SpriteName } from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'
import { useZalogowany } from '@/components/KontoProvider'
import LinkGracza from '@/components/LinkGracza'

type Typ = 'follow' | 'sync' | 'comment'

type Notif = {
  id: number
  typ: Typ
  /** Kto to zrobił — osobno od treści, żeby dało się podlinkować profil.
      `null` = powiadomienie systemowe (np. sync), które nie ma sprawcy. */
  autor: string | null
  /** Co zrobił — bez nicku na początku (ten dokleja LinkGracza). */
  tekst: string
  czas: string
  postac?: string
  nowe?: boolean
}

// Sprite z gry na każdy typ powiadomienia — jedno źródło prawdy zamiast ifów w JSX.
const IKONA: Record<Typ, SpriteName> = {
  follow: 'friendfinder', // Friend Finder — ktoś Cię obserwuje
  sync: 'trophy', // Challenge Trophy — nowe achievementy
  comment: 'friends', // BFFS! — komentarz
}

// DEMO — przykładowe powiadomienia (realne dojdą z backendem social w projekcie końcowym).
const NOTIFS: Notif[] = [
  {
    id: 1,
    typ: 'follow',
    autor: 'VoidKing',
    tekst: 'zaczął Cię obserwować',
    czas: '5 min temu',
    postac: 'Azazel',
    nowe: true,
  },
  {
    id: 2,
    typ: 'sync',
    autor: null,
    tekst: 'Zsynchronizowano 3 nowe achievementy',
    czas: '1 godz temu',
    nowe: true,
  },
  {
    id: 3,
    typ: 'comment',
    autor: 'VoidKing',
    tekst: 'skomentował Twój run',
    czas: '2 godz temu',
    postac: 'Azazel',
  },
]

/**
 * Dzwonek z licznikiem nieprzeczytanych + rozwijana kartka powiadomień.
 * Licznik gaśnie po ZAMKNIĘCIU panelu, nie po otwarciu — dzięki temu przez cały czas
 * czytania widać, które wpisy są nowe (czerwony akcent).
 */
export default function NotificationsBell() {
  const zalogowany = useZalogowany()
  // Gość nie ma powiadomień — pusty dzwonek bez licznika, z zaproszeniem do logowania.
  const notyfikacje = zalogowany ? NOTIFS : []
  const [open, setOpen] = useState(false)
  const [zamyka, setZamyka] = useState(false)
  const [przeczytane, setPrzeczytane] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unread = przeczytane ? 0 : notyfikacje.filter((n) => n.nowe).length

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
    setPrzeczytane(true)
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
                    className={'notif-item' + (n.nowe && !przeczytane ? ' notif-item--nowe' : '')}
                    role="menuitem"
                  >
                    <LinkGracza nick={n.autor} className="notif-ic-link">
                      <span className={'notif-ic notif-ic--' + n.typ}>
                        {n.postac ? (
                          <>
                            <img src={ikonaPostaci(n.postac)} alt="" />
                            {/* Typ jako mały znaczek w rogu portretu — portret mówi KTO,
                                znaczek mówi CO zrobił. */}
                            <span className="notif-typ">
                              <Sprite name={IKONA[n.typ]} size={13} />
                            </span>
                          </>
                        ) : (
                          <Sprite name={IKONA[n.typ]} size={22} />
                        )}
                      </span>
                    </LinkGracza>
                    <span className="notif-body">
                      <span className="notif-tekst">
                        {n.autor && (
                          <>
                            <LinkGracza nick={n.autor}>
                              <b className="notif-autor">{n.autor}</b>
                            </LinkGracza>{' '}
                          </>
                        )}
                        {n.tekst}
                      </span>
                      <span className="notif-czas">{n.czas}</span>
                    </span>
                    {n.nowe && !przeczytane && <span className="notif-kropka" aria-label="nowe" />}
                  </li>
                ))}
              </ul>
              {/* DEMO jako pieczątka odbita na kartce, nie jako stopka-doklejka. */}
              <div className="notif-pop-foot">
                <span className="notif-stempel">Demo</span>
                <span className="notif-stempel-opis">
                  realne powiadomienia w projekcie końcowym
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
