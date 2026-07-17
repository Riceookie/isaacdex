'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Sprite from '@/components/Sprite'
import DecorMark from '@/components/DecorMark'
import type { DecorId } from '@/lib/pfpDecor'
import { avatarGracza, wlasnyAvatar } from '@/lib/chars'

export type WizytowkaGracza = {
  znaleziony: true
  nick: string
  kolor: string | null
  avatar: string | null
  opis: string | null
  ja: boolean
  znajomy: boolean
  obserwowany: boolean
  obserwujeMnie: boolean
  obserwujacych: number
  wpisy: number
  dekoracja: DecorId
  /** Postęp osiągnięć — null, gdy gracz nie ma podpiętego Steama (nie zgadujemy). */
  procent: number | null
}

/**
 * Pamięć podręczna wizytówek — moduł, nie stan komponentu.
 *
 * Ten sam gracz potrafi wystąpić w feedzie kilkanaście razy (VoidKing pod każdym wpisem),
 * a bez wspólnego cache każdy dymek pytałby serwer od nowa. Trzymamy też obietnice w locie,
 * żeby dwa szybkie najazdy nie wystrzeliły dwóch zapytań.
 */
const cache = new Map<string, WizytowkaGracza | null>()
const wLocie = new Map<string, Promise<WizytowkaGracza | null>>()

function pobierz(nick: string): Promise<WizytowkaGracza | null> {
  const k = nick.toLowerCase()
  if (cache.has(k)) return Promise.resolve(cache.get(k) ?? null)
  const juz = wLocie.get(k)
  if (juz) return juz
  const p = fetch(`/api/gracz/${encodeURIComponent(nick)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d: WizytowkaGracza | null) => {
      cache.set(k, d)
      wLocie.delete(k)
      return d
    })
    .catch(() => {
      // Sieć padła — nie zapisujemy do cache, żeby następny najazd spróbował jeszcze raz.
      wLocie.delete(k)
      return null
    })
  wLocie.set(k, p)
  return p
}

/** Znaczek relacji — ten sam język co na kartach graczy. */
function Relacja({ d }: { d: WizytowkaGracza }) {
  if (d.ja) return <span className="rel-badge ja">To Ty</span>
  if (d.znajomy)
    return (
      <span className="rel-badge friend">
        <Sprite name="friends" size={12} /> Znajomy
      </span>
    )
  if (d.obserwujeMnie) return <span className="rel-badge back">Obserwuje Cię</span>
  if (d.obserwowany) return <span className="rel-badge back">Obserwujesz</span>
  return null
}

/**
 * Mini-profil pod kursorem (jak dymek na Steamie): avatar, nick, opis, relacja i liczby.
 *
 * Pojawia się dopiero po chwili najechania (`OPOZNIENIE`) i tylko dla myszy — na dotyku
 * „hover" to pierwszy tap, więc dymek zjadałby wejście na profil.
 */
const OPOZNIENIE = 420

export default function KartaHover({
  nick,
  kotwica,
  onZamknij,
}: {
  nick: string
  kotwica: HTMLElement
  onZamknij: () => void
}) {
  const [dane, setDane] = useState<WizytowkaGracza | null | undefined>(undefined)
  const [poz, setPoz] = useState<{ left: number; top: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let zyje = true
    pobierz(nick).then((d) => zyje && setDane(d))
    return () => {
      zyje = false
    }
  }, [nick])

  // Pozycja liczona po renderze (znamy wysokość) — nad kotwicą, a jak brak miejsca, to pod.
  useLayoutEffect(() => {
    if (!ref.current) return
    const k = kotwica.getBoundingClientRect()
    const p = ref.current.getBoundingClientRect()
    const margines = 8
    const nad = k.top - p.height - margines
    const top = nad >= 8 ? nad : Math.min(k.bottom + margines, window.innerHeight - p.height - 8)
    const left = Math.max(8, Math.min(k.left, window.innerWidth - p.width - 8))
    setPoz({ left, top })
  }, [kotwica, dane])

  // Escape zamyka — dymek bywa „przyklejony", gdy kursor wyjdzie poza okno.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onZamknij()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onZamknij])

  // Nie znaleziono gracza (np. nick z czatu bez konta) — nie pokazujemy pustego dymka.
  if (dane === null) return null

  const wlasny = dane ? wlasnyAvatar(dane.avatar) : false

  return createPortal(
    <div
      className="hov-karta"
      ref={ref}
      role="tooltip"
      style={poz ? { left: poz.left, top: poz.top } : { opacity: 0, pointerEvents: 'none' }}
      // Kursor może wjechać w sam dymek — wtedy ma zostać otwarty.
      onPointerEnter={() => {}}
      onPointerLeave={onZamknij}
    >
      {dane === undefined ? (
        <div className="hov-laduje">
          <span className="hov-kropki" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </div>
      ) : (
        <>
          <div className="hov-glowa">
            <span className={'hov-ava-box' + (dane.dekoracja === 'none' ? '' : ' z-decor')}>
              <img
                className={'hov-ava' + (wlasny ? ' foto' : '')}
                src={avatarGracza(dane.avatar)}
                alt=""
                width={44}
                height={44}
              />
              <DecorMark id={dane.dekoracja} />
            </span>
            <span className="hov-kto">
              <b style={dane.kolor ? { color: dane.kolor } : undefined}>{dane.nick}</b>
              <Relacja d={dane} />
            </span>
            {dane.procent === 100 && (
              <span className="hov-dg" title="Dead God — 100% osiągnięć">
                <Sprite name="deadgod" size={20} />
              </span>
            )}
          </div>

          <p className="hov-opis">{dane.opis ?? 'Bez opisu.'}</p>

          {/* Pasek postępu tylko dla graczy z podpiętym Steamem — reszcie nie mamy co
              narysować, a kreska „0%" wyglądałaby jak ocena, nie jak brak danych. */}
          {dane.procent !== null && (
            <div className="hov-pasek" title={`${dane.procent}% osiągnięć`}>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${dane.procent}%` }} />
              </div>
              <b>{dane.procent}%</b>
            </div>
          )}

          <ul className="hov-staty">
            <li title="Obserwujący">
              <Sprite name="friendfinder" size={13} /> {dane.obserwujacych}
            </li>
            <li title="Wpisy w feedzie">
              <Sprite name="book" size={13} /> {dane.wpisy}
            </li>
          </ul>
        </>
      )}
    </div>,
    document.body,
  )
}

export { OPOZNIENIE }
