'use client'

import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/components/JezykProvider'

/**
 * Ukryte wejście do Sekretnego Pokoju — rysa w ścianie na dole sidebara.
 *
 * Jak w grze: najpierw trzeba ją ROZBIĆ. Pierwsze kliknięcie NIE przenosi na stronę —
 * rysa pęka w dziurę w ścianie, sypie się pył i kamienie, a z głośnika leci dżingiel
 * „secret room" (holy!). Dopiero kliknięcie w DZIURĘ otwiera Sekretny Pokój. Dzięki temu
 * odkrycie jest małym zdarzeniem, a nie zwykłym linkiem.
 *
 * Kolor rysy jest przeciwny do motywu (jasny na ciemnym, ciemny na jasnym), żeby dało się
 * ją w ogóle zauważyć — CSS przełącza `--crack-fill` po `data-theme` (patrz sekret.css).
 */

// Ile okruchów sypie się z dziury i jak daleko lecą — losujemy raz, przy rozbiciu.
const ILE_OKRUCHOW = 12

type Okruch = {
  left: number
  dx: number
  delay: number
  size: number
  rot: number
  kamien: boolean
}

function wylosujOkruchy(): Okruch[] {
  return Array.from({ length: ILE_OKRUCHOW }, () => ({
    left: 20 + Math.random() * 60, // startuje w okolicy dziury (środek szczeliny)
    dx: (Math.random() - 0.5) * 44, // rozrzut na boki
    delay: Math.random() * 0.18,
    size: 2 + Math.round(Math.random() * 4),
    rot: (Math.random() - 0.5) * 320,
    kamien: Math.random() > 0.45, // część to kamyki (większe, ciemniejsze), część drobny pył
  }))
}

export default function SekretneWejscie({ onWejdz }: { onWejdz?: () => void }) {
  const t = useT()
  const router = useRouter()
  const [rozbite, setRozbite] = useState(false)
  const [okruchy, setOkruchy] = useState<Okruch[]>([])
  const audio = useRef<HTMLAudioElement | null>(null)

  const rozbij = () => {
    setRozbite(true)
    setOkruchy(wylosujOkruchy())
    // Dżingiel „secret room" (holy!). Klik to gest użytkownika, więc autoplay przejdzie;
    // gdyby przeglądarka i tak odmówiła, po cichu odpuszczamy — sekret nie może się wywalić.
    try {
      const a = audio.current ?? new Audio('/tboi/sfx/secret-jingle.wav')
      audio.current = a
      a.volume = 0.55
      a.currentTime = 0
      void a.play().catch(() => {})
    } catch {
      /* brak Audio (SSR/edge) — trudno, lecimy dalej bez dźwięku */
    }
  }

  const wejdz = () => {
    onWejdz?.()
    router.push('/sekret')
  }

  return (
    <button
      type="button"
      className={'side-secret' + (rozbite ? ' rozbite' : '')}
      onClick={rozbite ? wejdz : rozbij}
      aria-label={t(rozbite ? 'sekret.wejscieOtwarte' : 'sekret.wejscieTip')}
      title={t(rozbite ? 'sekret.wejscieOtwarte' : 'sekret.wejscieTip')}
    >
      {rozbite ? (
        <img
          className="side-secret-hole"
          src="/tboi/ui/secret-hole.png"
          alt=""
          width={44}
          height={37}
          draggable={false}
        />
      ) : (
        // Rysa rysowana inline SVG — stroke bierze kolor z `--crack-fill` (przełączany po
        // motywie w CSS), więc odcina się od ściany. Inline (nie mask/bg-data-uri), bo tamte
        // w Chrome bywają kapryśne z surowym data-URI.
        <span className="side-secret-crack" aria-hidden>
          <svg viewBox="0 0 80 24" preserveAspectRatio="none">
            {/* Kolor stroke ustawia CSS (`stroke: var(--crack-fill)`) — var() NIE działa
                w atrybucie prezentacyjnym SVG, tylko we właściwości CSS. */}
            <g fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 13 L14 10 L22 16 L34 7 L46 17 L58 9 L67 15 L79 11" />
              <path d="M22 16 L26 22" />
              <path d="M46 17 L42 23" />
              <path d="M34 7 L38 2" />
              <path d="M58 9 L61 3" />
            </g>
          </svg>
        </span>
      )}

      {/* Pył i kamienie sypią się raz, przy rozbiciu — pozycje i rozrzut wylosowane. */}
      {rozbite && okruchy.length > 0 && (
        <span className="side-secret-pyl" aria-hidden>
          {okruchy.map((o, i) => (
            <i
              key={i}
              className={'okruch' + (o.kamien ? ' kamien' : '')}
              style={
                {
                  left: `${o.left}%`,
                  '--dx': `${o.dx}px`,
                  '--dl': `${o.delay}s`,
                  '--sz': `${o.size}px`,
                  '--rot': `${o.rot}deg`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </button>
  )
}
