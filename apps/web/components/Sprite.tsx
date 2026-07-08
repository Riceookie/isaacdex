import type { CSSProperties } from 'react'

// Sprite'y z The Binding of Isaac (public/tboi) używane zamiast emoji.
// Ikony itemów/pickupów pobrane z wiki, mucha i „book" z assetów projektu.
const SPRITES = {
  godhead: 'icons/godhead.webp', // Godhead — logo, „boskie"/rzadkie osiągnięcia
  skull: 'icons/dead-cat.webp', // Dead Cat — Dead God / śmierć / hardcore
  heart: 'icons/heart.webp', // Red Heart — polub / miłość
  d6: 'icons/d6.webp', // The D6 — losowanie / reroll
  clock: 'icons/broken-watch.webp', // Broken Watch — ostatnia aktywność / czas
  friends: 'icons/bff.webp', // BFFS! — znajomi / społeczność
  stats: 'icons/death-certificate.webp', // Death Certificate — statystyki / dane
  gear: 'icons/battery.webp', // The Battery — ustawienia
  bomb: 'icons/bomb.webp', // Bomb — ostrzeżenie / uwaga
  advisor: 'icons/spoon-bender.webp', // Spoon Bender — doradca (namierzanie)
  coin: 'icons/coin.webp', // Golden Penny — rzadkie / złoto / trofeum
  book: 'icons/book.png', // Missing Page (giantbook) — kolekcja
  fly: 'fly-big.png', // Mucha — motyw kursora
} as const

export type SpriteName = keyof typeof SPRITES

type Props = {
  name: SpriteName
  size?: number
  alt?: string
  className?: string
  style?: CSSProperties
}

/** Pixelowa ikona Isaaca. Domyślnie dekoracyjna (aria-hidden); podaj `alt`, gdy niesie treść. */
export default function Sprite({ name, size = 20, alt = '', className, style }: Props) {
  return (
    <img
      src={`/tboi/${SPRITES[name]}`}
      alt={alt}
      width={size}
      height={size}
      className={'sprite' + (className ? ' ' + className : '')}
      style={style}
      aria-hidden={alt ? undefined : true}
      draggable={false}
    />
  )
}
