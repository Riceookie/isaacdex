import type { CSSProperties } from 'react'

// Deklaratywna ozdoba ramki kartki: mucha, pająk na nitce albo kropla krwi —
// PRAWDZIWE sprity z gry (public/tboi). Renderowane jako zwykły JSX wewnątrz kartki,
// BEZ mutacji DOM (poprzedni CardDecor robił appendChild i wywalał Reacta przy nawigacji).
// Kartka musi być position:relative (są — trzymają pinezki).

type Kind = 'fly' | 'spider' | 'blood'
type Pos = 'tl' | 'tr' | 'bl' | 'br'

const POS: Record<Pos, CSSProperties> = {
  tl: { top: 6, left: 12 },
  tr: { top: 6, right: 12 },
  bl: { bottom: 6, left: 12 },
  br: { bottom: 6, right: 12 },
}

// Sprity wroga/przedmiotu z assetów gry; krew = narysowana plama (splatter).
const SRC = {
  fly: '/tboi/fly-big.png',
  spider: '/tboi/items/collectibles/mutantspider.png',
  blood: '/tboi/blood-splatter.svg',
} as const

const SIZE: Record<Kind, number> = { fly: 28, spider: 26, blood: 34 }

export default function FrameDecor({ kind = 'fly', pos = 'tr' }: { kind?: Kind; pos?: Pos }) {
  const img = (
    <img
      className="sprite fd-img"
      src={SRC[kind]}
      width={SIZE[kind]}
      height={SIZE[kind]}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  )
  return (
    <span className={`frame-decor fd-${kind}`} style={POS[pos]} aria-hidden="true">
      {kind === 'spider' ? (
        <>
          <span className="fd-thread" />
          {img}
        </>
      ) : (
        img
      )}
    </span>
  )
}
