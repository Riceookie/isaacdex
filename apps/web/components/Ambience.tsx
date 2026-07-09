'use client'

import { useEffect, useState } from 'react'

/** Odręczne doodle Isaaca (styl kredką) — pojedynczy kolor, currentColor. */
const DOODLES: Record<string, React.ReactNode> = {
  smile: (
    <>
      <circle cx="16" cy="16" r="12" />
      <circle cx="11.5" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="20.5" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <path d="M10 19c2 3 10 3 12 0" />
    </>
  ),
  sad: (
    <>
      <circle cx="16" cy="16" r="12" />
      <circle cx="11.5" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="20.5" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <path d="M10 22c2-3 10-3 12 0" />
    </>
  ),
  fly: (
    <>
      <ellipse cx="16" cy="18" rx="4" ry="5" />
      <path d="M12 14c-5-4-9-3-9 0 0 2 4 3 8 2" />
      <path d="M20 14c5-4 9-3 9 0 0 2-4 3-8 2" />
      <path d="M16 8v3" />
    </>
  ),
  poop: (
    <>
      <path d="M9 27h14c1.5 0 2.5-2 1-3 2-1 1-4-1-4 1.5-2-1-4-3-3 0-3-6-3-6 0-2-1-4 1-3 3-2 0-3 3-1 4-1.5 1 0 3 1.5 3z" />
    </>
  ),
  bomb: (
    <>
      <circle cx="15" cy="19" r="9" />
      <path d="M20 11l3-3" />
      <path d="M23 8c0-2 3-2 3 0" />
    </>
  ),
  laser: (
    <>
      <path d="M3 16l6-2-4-3 8 1-3-4 7 3-1-5 4 6 3-3-1 6" />
    </>
  ),
}
const NAZWY = Object.keys(DOODLES)
const KOLORY = ['#e5544b', '#e0b64c', '#5bbf6a', '#8a6fd6', '#c98a4e']

type Plama = {
  id: number
  typ: string
  kolor: string
  top: string
  left: string
  rot: number
  scale: number
}

/**
 * Warstwa klimatu: kilka losowych doodle w rogach ekranu + dryfujące drobinki kurzu.
 * Losowane po zamontowaniu (po stronie klienta), więc inne przy każdym odświeżeniu i
 * bez rozjazdu hydratacji. Nieklikalne, pod treścią.
 */
export default function Ambience() {
  const [plamy, setPlamy] = useState<Plama[]>([])

  useEffect(() => {
    const ile = 5 + Math.floor(Math.random() * 3) // 5–7 doodli
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const naKrawedzi = () => {
      // trzymaj doodle przy brzegach (rogi/krawędzie), z dala od środka
      const os = () => (Math.random() < 0.5 ? rand(2, 16) : rand(84, 96))
      return { top: `${os()}%`, left: `${os()}%` }
    }
    const nowe: Plama[] = Array.from({ length: ile }, (_, i) => {
      const { top, left } = naKrawedzi()
      return {
        id: i,
        typ: NAZWY[Math.floor(Math.random() * NAZWY.length)],
        kolor: KOLORY[Math.floor(Math.random() * KOLORY.length)],
        top,
        left,
        rot: rand(-18, 18),
        scale: rand(0.8, 1.4),
      }
    })
    setPlamy(nowe)
  }, [])

  return (
    <div className="ambience" aria-hidden="true">
      {/* Dryfujący kurz (statyczne pozycje, żeby nie rozjechać hydratacji). */}
      <span
        className="dust"
        style={{ left: '12%', animationDelay: '0s', animationDuration: '17s' }}
      />
      <span
        className="dust"
        style={{ left: '28%', animationDelay: '5s', animationDuration: '22s' }}
      />
      <span
        className="dust"
        style={{ left: '47%', animationDelay: '11s', animationDuration: '19s' }}
      />
      <span
        className="dust"
        style={{ left: '63%', animationDelay: '3s', animationDuration: '24s' }}
      />
      <span
        className="dust"
        style={{ left: '81%', animationDelay: '8s', animationDuration: '20s' }}
      />
      <span
        className="dust"
        style={{ left: '92%', animationDelay: '14s', animationDuration: '16s' }}
      />

      {plamy.map((p) => (
        <svg
          key={p.id}
          className="doodle"
          viewBox="0 0 32 32"
          width={30}
          height={30}
          fill="none"
          stroke={p.kolor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rot}deg) scale(${p.scale})`,
            color: p.kolor,
          }}
        >
          {DOODLES[p.typ]}
        </svg>
      ))}
    </div>
  )
}
