import type { CSSProperties } from 'react'

// Sprite'y z The Binding of Isaac (public/tboi) używane zamiast emoji.
// Ikony itemów/pickupów pobrane z wiki, mucha i „book" z assetów projektu.
// Ostre sprite'y itemów prosto z assetów gry (items/collectibles) — spójny styl,
// czytelne w większym rozmiarze. Pickupy (serce/moneta/bomba) zostają jako czyste ikony.
const SPRITES = {
  godhead: 'items/collectibles/godhead.png', // Godhead — „boskie"/rzadkie
  skull: 'items/collectibles/deadcat.png', // Dead Cat — śmierć / hardcore
  heart: 'icons/heart.webp', // Red Heart — polub / miłość
  d6: 'items/collectibles/dice.png', // The D6 — losowanie / reroll
  clock: 'items/collectibles/brokenwatch.png', // Broken Watch — czas
  friends: 'items/collectibles/bffs.png', // BFFS! — czat / społeczność
  stats: 'items/collectibles/deathcertificate.png', // Death Certificate
  gear: 'items/collectibles/thebattery.png', // The Battery
  bomb: 'icons/bomb.webp', // Bomb — ostrzeżenie
  advisor: 'items/collectibles/spoonbender.png', // Spoon Bender
  coin: 'icons/coin.webp', // Golden Penny — złoto
  book: 'items/collectibles/bookofsecrets.png', // Book of Secrets — kolekcja
  fly: 'fly-big.png', // Mucha — kursor

  // ── Ikony wg życzeń użytkownika (mapowanie 1:1 z listy) ──
  sun: 'ui/sun.png', // The Sun — motyw „normalne strony"
  moon: 'ui/moon.png', // The Moon — motyw „tainted strony"
  trophy: 'ui/trophy.png', // Challenge Trophy — achievementy
  deadgod: 'achievements/deadgod-icon.png', // rysunek Dead God — dead god
  membercard: 'items/collectibles/membercard.png', // Member Card — rzadkie achievementy
  heartmark: 'marks/heart-mark.png', // Heart mark — zdobyte marki
  starmark: 'marks/star-mark.png', // Star mark — completion marks
  stopwatch: 'items/collectibles/stopwatch.png', // Stop Watch — ostatnio odblokowane
  chad: 'items/collectibles/littlechad.png', // Little C.H.A.D — postępy postaci
  dadsnote: 'items/collectibles/dadsnote.png', // Dad's Note — Pulpit (home)
  isaacHead: 'chars/isaac.webp', // głowa Isaaca — Profil
  foundsoul: 'items/trinkets/foundsoul.png', // Found Soul — Doradca
  kidsdrawing: 'items/trinkets/kidsdrawing.png', // Kid's Drawing — Statystyki
  friendfinder: 'items/collectibles/friendfinder.png', // Friend Finder — Znajomi
  superfan: 'items/collectibles/smbsuperfan.png', // SMB Super Fan — Ustawienia
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
export default function Sprite({ name, size = 24, alt = '', className, style }: Props) {
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
