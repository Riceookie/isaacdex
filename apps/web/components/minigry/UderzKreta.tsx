'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 3 — „Uderz Kreta" (Whac-a-Mole). Z dziur (secret-hole) wyskakują krety (mole
 * z gry); klikasz/tapiesz, żeby je ubić, zanim schowają się z powrotem. Ubij CEL sztuk, zanim
 * skończy się CZAS — inaczej licznik i zegar wracają do startu (miękki reset, bez frustracji).
 *
 * Pętla jednym `setInterval` (100 ms): odlicza czas, chowa krety, którym minął czas na ekranie,
 * i co pewien interwał wystawia nowego kreta w losowej pustej dziurze. Stan w refach + `tick()`.
 */

const DZIUR = 9 // siatka 3×3
const CEL = 10 // ile ubić, by wygrać
const CZAS = 20 // sekundy
type Stan = 'pusta' | 'kret' | 'ubity'

export default function UderzKreta({ onWin }: { onWin: () => void }) {
  const t = useT()
  const dziuryRef = useRef<Stan[]>(Array(DZIUR).fill('pusta'))
  const doKiedyRef = useRef<number[]>(Array(DZIUR).fill(0)) // kret znika, gdy now > doKiedy
  const wynikRef = useRef(0)
  const czasRef = useRef(CZAS)
  const spawnAcc = useRef(0)
  const [, tick] = useReducer((n: number) => n + 1, 0)
  const [wygrana, setWygrana] = useState(false)
  const [zawal, setZawal] = useState(false)
  const wygranaRef = useRef(false)

  useEffect(() => {
    let now = 0
    const id = window.setInterval(() => {
      if (wygranaRef.current) return
      now += 0.1
      czasRef.current = Math.max(0, czasRef.current - 0.1)

      // Chowanie kretów po czasie życia.
      for (let i = 0; i < DZIUR; i++) {
        if (dziuryRef.current[i] === 'kret' && now > doKiedyRef.current[i]) {
          dziuryRef.current[i] = 'pusta'
        }
      }
      // Spawn co ~0.62 s w losowej pustej dziurze; przyspiesza pod koniec.
      spawnAcc.current += 0.1
      const tempo = 0.42 + 0.35 * (czasRef.current / CZAS)
      if (spawnAcc.current >= tempo) {
        spawnAcc.current = 0
        const puste = dziuryRef.current
          .map((s, i) => (s === 'pusta' ? i : -1))
          .filter((i) => i >= 0)
        if (puste.length) {
          const i = puste[Math.floor(Math.random() * puste.length)]
          dziuryRef.current[i] = 'kret'
          doKiedyRef.current[i] = now + 0.85 // ile jest na wierzchu
        }
      }
      // Czas minął bez celu → miękki reset.
      if (czasRef.current <= 0 && wynikRef.current < CEL) {
        setZawal(true)
        window.setTimeout(() => setZawal(false), 900)
        wynikRef.current = 0
        czasRef.current = CZAS
        now = 0
        dziuryRef.current = Array(DZIUR).fill('pusta')
      }
      tick()
    }, 100)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function uderz(i: number) {
    if (wygranaRef.current || dziuryRef.current[i] !== 'kret') return
    dziuryRef.current[i] = 'ubity'
    wynikRef.current += 1
    window.setTimeout(() => {
      if (dziuryRef.current[i] === 'ubity') dziuryRef.current[i] = 'pusta'
      tick()
    }, 260)
    if (wynikRef.current >= CEL) {
      wygranaRef.current = true
      setWygrana(true)
      window.setTimeout(onWin, 1100)
    }
    tick()
  }

  return (
    <div className="mg mg-krety">
      <p className="mg-opis small">{t('sekret.gra3Opis')}</p>

      <div className={'mg-krety-pasek small' + (zawal ? ' mg-zawal' : '')}>
        <span>
          {t('sekret.gra3Licznik')}: {Math.min(wynikRef.current, CEL)} / {CEL}
        </span>
        <span className="mg-krety-czas">
          {t('sekret.gra3Czas')}: {Math.ceil(czasRef.current)}s
        </span>
      </div>

      <div className={'mg-krety-siatka' + (wygrana ? ' mg-wygrana' : '')} role="application">
        {dziuryRef.current.map((s, i) => (
          <button
            key={i}
            type="button"
            className={'mg-dziura ' + s}
            onPointerDown={() => uderz(i)}
            aria-label="mole"
            disabled={wygrana}
          >
            <img className="mg-dziura-tlo" src="/tboi/ui/secret-hole.png" alt="" draggable={false} />
            <img className="mg-kret" src="/tboi/przeciwnicy/mole.png" alt="" draggable={false} />
            <span className="mg-splat" aria-hidden />
          </button>
        ))}
        {wygrana && <div className="mg-win">{t('sekret.gra3Win')}</div>}
      </div>
      {zawal && <p className="mg-status small mg-status-zle">{t('sekret.gra3Zawal')}</p>}
    </div>
  )
}
