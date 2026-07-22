'use client'

import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/components/JezykProvider'

/**
 * Ukryte wejście do Sekretnego Pokoju — rysa w ścianie na dole sidebara.
 *
 * Jak w grze: najpierw trzeba ją ROZBIĆ. Pierwsze kliknięcie NIE przenosi na stronę — rysa
 * pęka w dziurę, ściana wybucha chmurą pyłu i kamieni, a z głośnika leci ROZBICIE ŚCIANY
 * (rock crumble) plus dżingiel „secret room found". Dopiero kliknięcie w DZIURĘ otwiera
 * Sekretny Pokój. Dzięki temu odkrycie jest małym zdarzeniem, a nie zwykłym linkiem.
 *
 * Kolor rysy jest przeciwny do motywu (jasny na ciemnym, ciemny na jasnym), żeby dało się
 * ją w ogóle zauważyć — CSS przełącza `--crack-fill` po `data-theme` (patrz sekret.css).
 */

// Ile okruchów wybucha z dziury. Więcej = gęstszy wybuch; każdy leci własnym łukiem.
const ILE_OKRUCHOW = 30

type Okruch = {
  left: number // start w okolicy dziury
  bx: number // wektor wybuchu w bok (px)
  by: number // szczyt łuku w pionie (ujemny = w górę)
  delay: number
  size: number
  rot: number
  kamien: boolean
}

function wylosujOkruchy(): Okruch[] {
  return Array.from({ length: ILE_OKRUCHOW }, () => {
    // Kierunek wybuchu z okolicy środka: pełny okrąg, ale z przewagą na boki i w górę
    // (potem grawitacja i tak ściąga wszystko w dół — patrz keyframe side-secret-spad).
    const kat = Math.random() * Math.PI * 2
    const zasieg = 10 + Math.random() * 34
    return {
      left: 38 + Math.random() * 24,
      bx: Math.cos(kat) * zasieg,
      by: Math.sin(kat) * zasieg * 0.7 - 6, // lekko podbite w górę
      delay: Math.random() * 0.12,
      size: 2 + Math.round(Math.random() * 5),
      rot: (Math.random() - 0.5) * 420,
      kamien: Math.random() > 0.4, // część to kamyki (większe/ciemne), reszta drobny pył
    }
  })
}

export default function SekretneWejscie({ onWejdz }: { onWejdz?: () => void }) {
  const t = useT()
  const router = useRouter()
  const [rozbite, setRozbite] = useState(false)
  const [okruchy, setOkruchy] = useState<Okruch[]>([])

  // Dwa dźwięki naraz: rozbicie ściany (rock crumble) + dżingiel „secret room found".
  // Klik to gest użytkownika, więc autoplay przejdzie; gdyby przeglądarka odmówiła —
  // po cichu odpuszczamy (sekret nie może się wywalić przez brak dźwięku).
  const zagraj = (src: string, glosnosc: number) => {
    try {
      const a = new Audio(src)
      a.volume = glosnosc
      void a.play().catch(() => {})
    } catch {
      /* brak Audio (SSR/edge) — trudno, lecimy dalej bez dźwięku */
    }
  }

  const rozbij = () => {
    setRozbite(true)
    setOkruchy(wylosujOkruchy())
    zagraj('/tboi/sfx/wall-break.wav', 0.6) // ściana pęka
    zagraj('/tboi/sfx/secret-found.ogg', 0.5) // …i sekret znaleziony
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

      {/* Wybuch przy rozbiciu: fala uderzeniowa + chmura pyłu + lecące kamienie. Odpala
          się raz — wszystkie pozycje i wektory wylosowane w `wylosujOkruchy`. */}
      {rozbite && okruchy.length > 0 && (
        <span className="side-secret-wybuch" aria-hidden>
          <span className="side-secret-fala" />
          <span className="side-secret-chmura" />
          {okruchy.map((o, i) => (
            <i
              key={i}
              className={'okruch' + (o.kamien ? ' kamien' : '')}
              style={
                {
                  left: `${o.left}%`,
                  '--bx': `${o.bx}px`,
                  '--by': `${o.by}px`,
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
