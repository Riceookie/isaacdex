'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 5 — „Unik przed Fetusem" (Fetus Dodge). Trzy pasy; Isaac rusza się TYLKO w poziomie
 * (strzałki / przyciski / dotknięcie pasa). Z góry lecą naprowadzane rakiety Epic Fetusa: dopóki
 * nie „zablokują się" (na ~połowie wysokości) śledzą twój pas, potem spadają w ustalonym pasie —
 * trzeba wtedy z niego uciec. Zrób CEL uników; masz 3 serca, trafienie zabiera jedno, a utrata
 * wszystkich resetuje próbę. Pętla rAF, stan w refach + `tick()`.
 */

const PASY = 3
const CEL = 10
const SERCA = 3
const SRODKI = [1 / 6, 3 / 6, 5 / 6] // środki pasów (ułamek szerokości)
const WYS = 240

type Rakieta = { id: number; x: number; y: number; vy: number; zablok: boolean }

export default function UnikFetus({ onWin }: { onWin: () => void }) {
  const t = useT()
  const scenaRef = useRef<HTMLDivElement>(null)
  const pasRef = useRef(1)
  const sercaRef = useRef(SERCA)
  const unikiRef = useRef(0)
  const rakietyRef = useRef<Rakieta[]>([])
  const nastId = useRef(0)
  const spawnAcc = useRef(0)
  const invulnDo = useRef(0)
  const [, tick] = useReducer((n: number) => n + 1, 0)
  const [wygrana, setWygrana] = useState(false)
  const [oberwane, setOberwane] = useState(false)
  const [reset, setReset] = useState(false)
  const wygranaRef = useRef(false)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let czas = 0

    const loop = (t2: number) => {
      const dt = Math.min(0.05, (t2 - last) / 1000)
      last = t2
      czas += dt
      if (!wygranaRef.current) {
        // Spawn rakiet — nieco częściej z każdym unikiem.
        spawnAcc.current += dt
        const tempo = Math.max(0.7, 1.25 - unikiRef.current * 0.05)
        if (spawnAcc.current >= tempo && rakietyRef.current.length < 3) {
          spawnAcc.current = 0
          rakietyRef.current.push({
            id: nastId.current++,
            x: SRODKI[pasRef.current],
            y: -18,
            vy: 96 + Math.random() * 34,
            zablok: false,
          })
        }
        const zostaja: Rakieta[] = []
        for (const r of rakietyRef.current) {
          r.y += r.vy * dt
          if (!r.zablok) {
            // Naprowadzanie: pełznij ku pasowi gracza, aż do „zablokowania".
            const cel = SRODKI[pasRef.current]
            const krok = 1.5 * dt
            r.x += Math.max(-krok, Math.min(krok, cel - r.x))
            if (r.y > WYS * 0.46) r.zablok = true
          }
          if (r.y >= WYS - 30) {
            // Uderzenie na wysokości gracza — który pas?
            const pasR = r.x < 1 / 3 ? 0 : r.x < 2 / 3 ? 1 : 2
            if (pasR === pasRef.current && czas > invulnDo.current) {
              sercaRef.current -= 1
              invulnDo.current = czas + 0.85
              setOberwane(true)
              window.setTimeout(() => setOberwane(false), 450)
              if (sercaRef.current <= 0) {
                setReset(true)
                window.setTimeout(() => setReset(false), 900)
                sercaRef.current = SERCA
                unikiRef.current = 0
                rakietyRef.current = []
              }
            } else if (pasR !== pasRef.current) {
              unikiRef.current += 1
              if (unikiRef.current >= CEL && !wygranaRef.current) {
                wygranaRef.current = true
                setWygrana(true)
                window.setTimeout(onWin, 1100)
              }
            }
            continue // rakieta znika
          }
          zostaja.push(r)
        }
        rakietyRef.current = zostaja
      }
      tick()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function idz(pas: number) {
    if (wygranaRef.current) return
    pasRef.current = Math.max(0, Math.min(PASY - 1, pas))
  }

  return (
    <div className="mg mg-fetus">
      <p className="mg-opis small">{t('sekret.gra5Opis')}</p>

      <div className="mg-fetus-pasek small">
        <span className="mg-fetus-serca" aria-label={`${sercaRef.current}/${SERCA}`}>
          {Array.from({ length: SERCA }).map((_, i) => (
            <img
              key={i}
              src="/tboi/icons/heart.webp"
              alt=""
              className={'mg-serce' + (i < sercaRef.current ? '' : ' puste')}
            />
          ))}
        </span>
        <span>
          {t('sekret.gra5Licznik')}: {Math.min(unikiRef.current, CEL)} / {CEL}
        </span>
      </div>

      <div
        ref={scenaRef}
        className={
          'mg-scena mg-fetus-scena' +
          (wygrana ? ' mg-wygrana' : '') +
          (oberwane ? ' mg-oberwane' : '')
        }
        style={{ height: WYS }}
        role="application"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') idz(pasRef.current - 1)
          if (e.key === 'ArrowRight') idz(pasRef.current + 1)
        }}
      >
        {/* Pasy — kliknięcie/tap pasa przenosi tam Isaaca; podświetlenie zagrożenia. */}
        {SRODKI.map((_, i) => {
          const grozi = rakietyRef.current.some(
            (r) => (r.x < 1 / 3 ? 0 : r.x < 2 / 3 ? 1 : 2) === i,
          )
          return (
            <button
              key={i}
              type="button"
              className={'mg-pas' + (grozi ? ' grozi' : '')}
              style={{ left: `${(i / PASY) * 100}%`, width: `${100 / PASY}%` }}
              onPointerDown={() => idz(i)}
              aria-label={`lane ${i + 1}`}
              tabIndex={-1}
            />
          )
        })}

        {/* Rakiety */}
        {rakietyRef.current.map((r) => (
          <img
            key={r.id}
            className={'mg-rakieta' + (r.zablok ? ' zablok' : '')}
            src="/tboi/icons/bomb.webp"
            alt=""
            style={{ left: `${r.x * 100}%`, top: `${r.y}px` }}
            draggable={false}
          />
        ))}

        {/* Isaac */}
        <img
          className="mg-isaac"
          src="/tboi/chars/isaac.webp"
          alt=""
          style={{ left: `${SRODKI[pasRef.current] * 100}%` }}
          draggable={false}
        />

        {wygrana && <div className="mg-win">{t('sekret.gra5Win')}</div>}
      </div>

      {/* Przyciski dla dotyku/klawiatury */}
      <div className="mg-fetus-sterowanie">
        <button type="button" className="btn mg-strzalka" onPointerDown={() => idz(pasRef.current - 1)} aria-label="left">
          ◀
        </button>
        <button type="button" className="btn mg-strzalka" onPointerDown={() => idz(pasRef.current + 1)} aria-label="right">
          ▶
        </button>
      </div>

      {reset && <p className="mg-status small mg-status-zle">{t('sekret.gra5Reset')}</p>}
    </div>
  )
}
