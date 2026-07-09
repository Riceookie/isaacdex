'use client'

import { useEffect, useRef, useState } from 'react'
import Sprite from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'

type Notif = {
  id: number
  typ: 'follow' | 'sync' | 'comment'
  tekst: string
  czas: string
  postac?: string
}

// DEMO — przykładowe powiadomienia (realne dojdą z backendem social w projekcie końcowym).
const NOTIFS: Notif[] = [
  {
    id: 1,
    typ: 'follow',
    tekst: 'VoidKing zaczął Cię obserwować',
    czas: '5 min temu',
    postac: 'Azazel',
  },
  { id: 2, typ: 'sync', tekst: 'Zsynchronizowano 3 nowe achievementy', czas: '1 godz temu' },
  {
    id: 3,
    typ: 'comment',
    tekst: 'VoidKing skomentował Twój run',
    czas: '2 godz temu',
    postac: 'Azazel',
  },
]

/** Dzwonek z licznikiem nieprzeczytanych + rozwijana lista. Otwarcie = przeczytane. */
export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(NOTIFS.length)
  const ref = useRef<HTMLDivElement>(null)

  // Zamknij po kliknięciu poza panelem.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onDoc)
    return () => window.removeEventListener('pointerdown', onDoc)
  }, [open])

  function toggle() {
    if (!open) setUnread(0) // otwarcie kasuje licznik
    setOpen((v) => !v)
  }

  return (
    <div className="notif" ref={ref}>
      <button
        className="util-icon"
        type="button"
        onClick={toggle}
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
        <div className="notif-pop" role="menu">
          <div className="notif-pop-head">Powiadomienia</div>
          <ul className="notif-list">
            {NOTIFS.map((n) => (
              <li key={n.id} className="notif-item" role="menuitem">
                <span className="notif-ic">
                  {n.postac ? (
                    <img src={ikonaPostaci(n.postac)} alt="" />
                  ) : (
                    <Sprite name="trophy" size={22} />
                  )}
                </span>
                <span className="notif-body">
                  <span>{n.tekst}</span>
                  <span className="muted small">{n.czas}</span>
                </span>
                {n.typ === 'follow' && <Sprite name="friendfinder" size={16} />}
                {n.typ === 'comment' && <Sprite name="friends" size={16} />}
              </li>
            ))}
          </ul>
          <div className="notif-pop-foot">
            <span className="muted small">DEMO — realne powiadomienia w projekcie końcowym</span>
          </div>
        </div>
      )}
    </div>
  )
}
