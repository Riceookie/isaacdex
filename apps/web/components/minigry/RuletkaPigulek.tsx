'use client'

import { useState } from 'react'
import { useT } from '@/components/JezykProvider'

/**
 * Mini-gra 4 — „Ruletka Pigułek" (Pill Roulette). Jak nieznane pigułki z gry: przed tobą dwie
 * (losowe kolory), połykasz jedną i dopiero wtedy wychodzi, czy była DOBRA, czy ZŁA. Trzeba
 * trafić trzy dobre POD RZĄD; zła pigułka zeruje serię. Szansa na dobrą jest podkręcona (~64%),
 * żeby gra była krótka i nie frustrowała.
 *
 * Kolory pigułek z palety zbliżonej do gry; dwie połówki kapsułki rysowane w CSS (bez sprite'ów).
 */

const KOLORY = ['#d94f4f', '#e0b23c', '#4f8fd9', '#6fb84f', '#b06fd9', '#d97fae', '#5fc2c2', '#e0863c']
const CEL = 3
const SZANSA_DOBRA = 0.64

type Pigula = { a: string; b: string }
function losujPigule(): Pigula {
  const a = KOLORY[Math.floor(Math.random() * KOLORY.length)]
  let b = KOLORY[Math.floor(Math.random() * KOLORY.length)]
  if (b === a) b = KOLORY[(KOLORY.indexOf(a) + 3) % KOLORY.length]
  return { a, b }
}

export default function RuletkaPigulek({ onWin }: { onWin: () => void }) {
  const t = useT()
  const [seria, setSeria] = useState(0)
  const [pary, setPary] = useState<[Pigula, Pigula]>(() => [losujPigule(), losujPigule()])
  const [odkryte, setOdkryte] = useState<{ i: number; dobra: boolean } | null>(null)
  const [zajete, setZajete] = useState(false)
  const [wygrana, setWygrana] = useState(false)

  function wybierz(i: number) {
    if (zajete || wygrana) return
    setZajete(true)
    const dobra = Math.random() < SZANSA_DOBRA
    setOdkryte({ i, dobra })
    const nowa = dobra ? seria + 1 : 0
    window.setTimeout(() => {
      setSeria(nowa)
      if (dobra && nowa >= CEL) {
        setWygrana(true)
        window.setTimeout(onWin, 1100)
        return
      }
      setPary([losujPigule(), losujPigule()])
      setOdkryte(null)
      setZajete(false)
    }, 1200)
  }

  return (
    <div className={'mg mg-pigulki' + (odkryte && !odkryte.dobra ? ' mg-trzask' : '')}>
      <p className="mg-opis small">{t('sekret.gra4Opis')}</p>

      {/* Seria: trzy serca-pip do zapełnienia. */}
      <div className="mg-seria" aria-label={`${seria} / ${CEL}`}>
        {Array.from({ length: CEL }).map((_, i) => (
          <span key={i} className={'mg-seria-pip' + (i < seria ? ' pelny' : '')} />
        ))}
      </div>

      <div className="mg-pigulki-rzad">
        {pary.map((p, i) => {
          const odkryta = odkryte?.i === i
          const stan = odkryta ? (odkryte!.dobra ? ' dobra' : ' zla') : ''
          return (
            <button
              key={i}
              type="button"
              className={'mg-pigula' + stan + (zajete && !odkryta ? ' przygasla' : '')}
              onClick={() => wybierz(i)}
              disabled={zajete || wygrana}
              aria-label="pill"
            >
              <span className="mg-pigula-cialo">
                <span className="mg-pigula-pol" style={{ background: p.a }} />
                <span className="mg-pigula-pol" style={{ background: p.b }} />
              </span>
              {odkryta && <span className="mg-pigula-znak">{odkryte!.dobra ? '✚' : '☠'}</span>}
            </button>
          )
        })}
      </div>

      <p className="mg-status small" aria-live="polite">
        {wygrana
          ? t('sekret.gra4Win')
          : odkryte
            ? odkryte.dobra
              ? t('sekret.gra4Dobra')
              : t('sekret.gra4Zla')
            : ' '}
      </p>
    </div>
  )
}
