'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 6 — „Ładowanie Baterii" (Battery Charge). Ładunek sam ucieka (jak 9 Volt, który
 * rozładowuje się w mroku), a pokój tym ciemniejszy, im mniej prądu. Stukasz szybko, żeby dobić
 * do 100% zanim spadnie do zera — jeśli zgaśnie, wraca do startu (miękki reset). Pętla rAF
 * odejmuje ładunek co klatkę; stuknięcie dorzuca; ciemność = funkcja ładunku.
 */

const START = 34
const UBYTEK = 15 // %/s
const STUK = 6 // % za stuknięcie
const PROG_CIEMNO = 60 // poniżej tego pokój zaczyna gasnąć

export default function LadowanieBaterii({ onWin }: { onWin: () => void }) {
  const t = useT()
  const ladunekRef = useRef(START)
  const [, tick] = useReducer((n: number) => n + 1, 0)
  const [wygrana, setWygrana] = useState(false)
  const [zgaslo, setZgaslo] = useState(false)
  const [iskra, bump] = useReducer((n: number) => n + 1, 0)
  const wygranaRef = useRef(false)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (t2: number) => {
      const dt = Math.min(0.05, (t2 - last) / 1000)
      last = t2
      if (!wygranaRef.current) {
        ladunekRef.current -= UBYTEK * dt
        if (ladunekRef.current <= 0) {
          ladunekRef.current = START
          setZgaslo(true)
          window.setTimeout(() => setZgaslo(false), 800)
        }
        tick()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function stuk() {
    if (wygranaRef.current) return
    ladunekRef.current = Math.min(100, ladunekRef.current + STUK)
    bump()
    if (ladunekRef.current >= 100) {
      wygranaRef.current = true
      setWygrana(true)
      window.setTimeout(onWin, 1100)
    }
  }

  const ladunek = Math.max(0, Math.min(100, ladunekRef.current))
  // Ciemność rośnie, gdy ładunek spada poniżej progu.
  const mrok = wygrana ? 0 : Math.max(0, Math.min(0.9, (PROG_CIEMNO - ladunek) / PROG_CIEMNO)) * 0.92
  const niski = ladunek < 28 && !wygrana

  return (
    <div className="mg mg-bateria">
      <p className="mg-opis small">{t('sekret.gra6Opis')}</p>

      <button
        type="button"
        className={'mg-bateria-scena' + (wygrana ? ' mg-wygrana' : '') + (niski ? ' mg-niski' : '')}
        onPointerDown={stuk}
        aria-label={t('sekret.gra6Stukaj')}
      >
        {/* Ciemność pełznąca po pokoju, gdy prąd słabnie. */}
        <span className="mg-bateria-mrok" style={{ opacity: mrok }} aria-hidden />

        {/* Bateria: obudowa + wypełnienie + iskra po stuknięciu. */}
        <span className="mg-akku" aria-hidden>
          <span className="mg-akku-koncowka" />
          <span className="mg-akku-obudowa">
            <span
              className={'mg-akku-wypelnienie' + (ladunek > 66 ? ' pelny' : ladunek > 33 ? ' sredni' : ' pusty')}
              style={{ height: `${ladunek}%` }}
            />
            <span className="mg-akku-blysk" key={iskra} />
          </span>
        </span>

        <span className="mg-bateria-pct">{Math.round(ladunek)}%</span>
        <span className="mg-bateria-tap">{t('sekret.gra6Stukaj')}</span>

        {wygrana && <span className="mg-win">{t('sekret.gra6Win')}</span>}
      </button>

      <p className="mg-status small" aria-live="polite">
        {zgaslo ? t('sekret.gra6Zgaslo') : niski ? t('sekret.gra6Ciemnosc') : ' '}
      </p>
    </div>
  )
}
