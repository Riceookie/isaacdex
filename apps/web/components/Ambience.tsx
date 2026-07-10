'use client'

import { useEffect, useState } from 'react'

// Pula elementów tła. Sprity z gry (muchy/krew/pająk) + kredkowe „doodle" (odręczne
// rysunki Isaaca). `waga` = ile razy trafia do losowania. Element ma `src` (sprite)
// albo `d` (ścieżka SVG doodla).
type PoolItem = { typ: string; waga: number; klasa: string; src?: string; d?: string }
const POOL: PoolItem[] = [
  { typ: 'fly', src: '/tboi/Fly.png', waga: 5, klasa: 'amb-fly' },
  { typ: 'fly-big', src: '/tboi/fly-big.png', waga: 2, klasa: 'amb-fly' },
  { typ: 'blood', src: '/tboi/blood-splatter.svg', waga: 2, klasa: 'amb-blood' },
  { typ: 'spider', src: '/tboi/items/collectibles/mutantspider.png', waga: 1, klasa: 'amb-spider' },
  // Doodle (kredka, currentColor).
  {
    typ: 'doodle',
    d: 'M10 19c2 3 10 3 12 0M11.5 13h.01M20.5 13h.01M16 4a12 12 0 100 24',
    waga: 1,
    klasa: 'amb-doodle',
  },
  { typ: 'doodle', d: 'M4 20c4-8 8 8 12 0s8-8 12 0', waga: 1, klasa: 'amb-doodle' },
  { typ: 'doodle', d: 'M16 4v24M6 8l20 16M26 8L6 24', waga: 1, klasa: 'amb-doodle' },
  {
    typ: 'doodle',
    d: 'M16 18a4 5 0 100-.01M12 14c-5-4-9-3-9 0M20 14c5-4 9-3 9 0',
    waga: 1,
    klasa: 'amb-doodle',
  },
]
const LOSOWNIK = POOL.flatMap((p) => Array<PoolItem>(p.waga).fill(p))
const KOLORY = ['#e5544b', '#e0b64c', '#5bbf6a', '#8a6fd6', '#c98a4e']

type Rekwizyt = {
  id: number
  klasa: string
  src?: string
  d?: string
  kolor?: string
  size: number
  top: string
  left: string
  rot: number
  opacity: number
  delay: number
}

/**
 * Warstwa klimatu: linie CRT + winieta (efekt ekranu) oraz rozsypane po CAŁYM ekranie
 * sprity z gry (muchy, krew, pająk) i kredkowe doodle + dryfujące drobinki kurzu.
 * Losowane po zamontowaniu (klient), więc inne przy każdym odświeżeniu i bez rozjazdu
 * hydratacji. Nieklikalne, pod treścią (nie na kartkach).
 */
export default function Ambience() {
  const [rekwizyty, setRekwizyty] = useState<Rekwizyt[]>([])

  useEffect(() => {
    const ile = 16 + Math.floor(Math.random() * 8) // 16–23 elementów, rozsypane wszędzie
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const os = () => rand(1, 97) // po całym ekranie
    const nowe: Rekwizyt[] = Array.from({ length: ile }, (_, i) => {
      const p = LOSOWNIK[Math.floor(Math.random() * LOSOWNIK.length)]
      const fly = p.typ.startsWith('fly')
      const doodle = p.typ === 'doodle'
      return {
        id: i,
        klasa: p.klasa,
        src: p.src,
        d: p.d,
        kolor: doodle ? KOLORY[Math.floor(Math.random() * KOLORY.length)] : undefined,
        size: fly ? rand(18, 30) : doodle ? rand(22, 34) : rand(22, 34),
        top: `${os()}%`,
        left: `${os()}%`,
        rot: rand(-20, 20),
        opacity: fly ? rand(0.35, 0.6) : doodle ? rand(0.16, 0.28) : rand(0.22, 0.4),
        delay: rand(0, 2),
      }
    })
    setRekwizyty(nowe)
  }, [])

  return (
    <div className="ambience" aria-hidden="true">
      {/* Efekt ekranu kineskopu (linie skanowania + winieta) — czysty CSS. */}
      <div className="crt" />

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

      {rekwizyty.map((r) =>
        r.d ? (
          <svg
            key={r.id}
            className={`amb-sprite ${r.klasa}`}
            viewBox="0 0 32 32"
            width={r.size}
            height={r.size}
            fill="none"
            stroke={r.kolor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              top: r.top,
              left: r.left,
              opacity: r.opacity,
              transform: `rotate(${r.rot}deg)`,
            }}
          >
            <path d={r.d} />
          </svg>
        ) : (
          <img
            key={r.id}
            className={`sprite amb-sprite ${r.klasa}`}
            src={r.src}
            width={r.size}
            height={r.size}
            alt=""
            draggable={false}
            style={{
              top: r.top,
              left: r.left,
              opacity: r.opacity,
              transform: `rotate(${r.rot}deg)`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ),
      )}
    </div>
  )
}
