// Dekoracje ramki pfp (frame decorations) — nakładane na polaroid profilu.
// Dwa rodzaje:
//  • overlay — pełna, gotowa nakładka PNG (sprite wpozycjonowany na przezroczystym
//    płótnie ~ rozmiar ramki; np. edytowane sprity Death/Brownie/Little Steven),
//  • sprite pozycjonowany — pojedynczy sprite w rogu ramki (`src` + `pos` + `size`).
// Część dekoracji jest ZABLOKOWANA — wymaga konkretnego achievementu Steam (`unlock.ach`
// = displayName). Jeśli gracz go nie ma, dekoracja jest niedostępna w pickerze.

export type DecorId =
  | 'none'
  | 'death'
  | 'brownie'
  | 'steven'
  | 'forgotten'
  | 'deadgod'
  | 'coin'
  | 'heart'
  | 'spider'
  | 'blood'
  | 'key'
  | 'bombblack'
  | 'redbaby'
  | 'darkbaby'
  | 'hairball'
  | 'poop'

export type Pos = 'tl' | 'tr' | 'bl' | 'br' | 'wrap'

export type Decor = {
  id: DecorId
  label: string
  overlay?: string // pełna nakładka (public/tboi/decor/…)
  src?: string // pojedynczy sprite pozycjonowany
  pos?: Pos
  size?: number // rozmiar sprite'a jako % szerokości ramki
  unlock?: { ach: string; text: string } // wymagany achievement (displayName) + opis PL
}

// Kolejność = kolejność w pickerze. „Brak" pierwsze.
export const DECORATIONS: Decor[] = [
  { id: 'none', label: 'Brak' },

  // ── Dekoracje z gotowych nakładek (edytowane sprity) — ZABLOKOWANE ──
  {
    id: 'death',
    label: 'Death',
    overlay: '/tboi/decor/death.png',
    unlock: { ach: "Death's Touch", text: 'Wymaga achievementu „Death’s Touch"' },
  },
  {
    id: 'brownie',
    label: 'Brownie',
    overlay: '/tboi/decor/brownie.png',
    unlock: { ach: 'A Secret Exit', text: 'Wymaga achievementu „A Secret Exit"' },
  },
  {
    id: 'steven',
    label: 'Little Steven',
    overlay: '/tboi/decor/steven.png',
    unlock: { ach: 'Little Steven', text: 'Wymaga achievementu „Little Steven"' },
  },
  // Zablokowane, na razie bez sprite'a (Karol ich nie ma — pokazują stan „zablokowane").
  {
    id: 'forgotten',
    label: 'Forgotten Lullaby',
    src: '/tboi/items/collectibles/mutantspider.png',
    pos: 'br',
    unlock: { ach: 'Forgotten Lullaby', text: 'Wymaga achievementu „Forgotten Lullaby"' },
  },
  {
    id: 'deadgod',
    label: 'Dead God',
    src: '/tboi/blood-splatter.svg',
    pos: 'wrap',
    unlock: { ach: 'Dead God', text: 'Wymaga achievementu „Dead God"' },
  },

  // ── Wolne dekoracje z pojedynczych sprite'ów ──
  // ── Wolne dekoracje (sprite w rogu wg zdjęć #7–#18) ──
  { id: 'coin', label: 'Moneta', src: '/tboi/icons/coin.webp', pos: 'bl' }, // #8
  { id: 'heart', label: 'Serce', src: '/tboi/icons/heart.webp', pos: 'br' }, // #12
  { id: 'spider', label: 'Pająk', src: '/tboi/items/collectibles/mutantspider.png', pos: 'bl' }, // #13
  { id: 'blood', label: 'Krew', src: '/tboi/blood-splatter.svg', pos: 'tl' }, // #11
  { id: 'key', label: 'Klucz', src: '/tboi/decor/key.png', pos: 'br' }, // #7
  { id: 'bombblack', label: 'Czarna bomba', src: '/tboi/decor/bomb-black.png', pos: 'tl' }, // #21
  { id: 'redbaby', label: 'Incubus', src: '/tboi/decor/red-baby.png', pos: 'tl' }, // #15
  { id: 'darkbaby', label: 'Lil Brimstone', src: '/tboi/decor/dark-baby.png', pos: 'tl' }, // #16
  { id: 'hairball', label: 'Guppy’s Hairball', src: '/tboi/decor/hairball.png', pos: 'bl' }, // #17
  { id: 'poop', label: 'Kupa', src: '/tboi/decor/poop.png', pos: 'br' }, // #18
]

export const DEFAULT_DECOR: DecorId = 'none'

const MAP = new Map<DecorId, Decor>(DECORATIONS.map((d) => [d.id, d]))

/** Bezpieczne pobranie dekoracji po id (fallback = „Brak"). */
export function getDecor(id: string | null | undefined): Decor {
  return MAP.get(id as DecorId) ?? DECORATIONS[0]
}

/** Czy dekoracja jest dostępna dla gracza (odblokowana albo bez wymagań). */
export function decorOdblokowana(d: Decor, odblokowane: Set<string>): boolean {
  return !d.unlock || odblokowane.has(d.unlock.ach)
}
