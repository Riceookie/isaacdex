'use client'

import { useEffect, useState } from 'react'

/**
 * Dwuklatkowa, rysowana animacja Isaaca do stanów „coś się dzieje": ładowanie oraz pusto/błąd.
 * Za każdym pokazaniem LOSUJE inną z zestawu (8 loading / 4 empty), żeby apka nie migała
 * w kółko tym samym rysunkiem. Klatki lecą jako CSS-owa maska (kształt z kanału alfa), więc
 * biorą kolor z `currentColor` i same dopasowują się do jasnego/ciemnego motywu.
 *
 * Pliki: public/anim/load1..16.png (pary 1-2, 3-4, …) i empty1..8.png (pary 1-2, …).
 */
const ILE = { load: 8, empty: 4 } as const

export default function IsaacAnim({
  rodzaj,
  maly = false,
}: {
  rodzaj: 'load' | 'empty'
  maly?: boolean
}) {
  const ile = ILE[rodzaj]
  // SSR renderuje parę 0 (stabilnie, bez błędu hydratacji); po zamontowaniu losujemy —
  // dzięki temu każde wejście w stan pokazuje inny rysunek.
  const [para, setPara] = useState(0)
  useEffect(() => setPara(Math.floor(Math.random() * ile)), [ile])

  const maska = (n: number) => {
    const src = `/anim/${rodzaj}${para * 2 + n}.png`
    return { WebkitMaskImage: `url('${src}')`, maskImage: `url('${src}')` }
  }

  return (
    <div className={'ianim' + (maly ? ' ianim-maly' : '')} aria-hidden>
      <span className="ianim-frame ianim-a" style={maska(1)} />
      <span className="ianim-frame ianim-b" style={maska(2)} />
    </div>
  )
}
