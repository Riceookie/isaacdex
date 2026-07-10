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
  | 'coin'
  | 'heart'
  | 'blood'
  | 'key'
  | 'bombblack'
  | 'poop'

export type Pos = 'tl' | 'tr' | 'bl' | 'br' | 'wrap'

export type Decor = {
  id: DecorId
  label: string
  overlay?: string // pełna nakładka (public/tboi/decor/…)
  thumb?: string // przycięta miniatura do pickera (overlaye są w większości przezroczyste)
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
    thumb: '/tboi/decor/th-death.png',
    unlock: { ach: "Death's Touch", text: 'Wymaga achievementu „Death’s Touch"' },
  },
  {
    id: 'brownie',
    label: 'Brownie',
    overlay: '/tboi/decor/brownie.png',
    thumb: '/tboi/decor/th-brownie.png',
    unlock: { ach: 'A Secret Exit', text: 'Wymaga achievementu „A Secret Exit"' },
  },
  {
    id: 'steven',
    label: 'Little Steven',
    overlay: '/tboi/decor/steven.png',
    thumb: '/tboi/decor/th-steven.png',
    unlock: { ach: 'Little Steven', text: 'Wymaga achievementu „Little Steven"' },
  },
  // ── Wolne dekoracje — nakładki wycięte 1:1 z Twoich zdjęć (#7–#21), więc pozycja
  //    i sprite dokładnie jak w mockupach ──
  {
    id: 'coin',
    label: 'Moneta',
    overlay: '/tboi/decor/ov-coin.png',
    thumb: '/tboi/decor/th-coin.png',
  }, // #8
  {
    id: 'heart',
    label: 'Serce',
    overlay: '/tboi/decor/ov-heart.png',
    thumb: '/tboi/decor/th-heart.png',
  }, // #12
  {
    id: 'blood',
    label: 'Krew',
    overlay: '/tboi/decor/ov-blood.png',
    thumb: '/tboi/decor/th-blood.png',
  }, // #11
  { id: 'key', label: 'Klucz', overlay: '/tboi/decor/ov-key.png', thumb: '/tboi/decor/th-key.png' }, // #7
  {
    id: 'bombblack',
    label: 'Czarna bomba',
    overlay: '/tboi/decor/ov-bomb.png',
    thumb: '/tboi/decor/th-bomb.png',
  }, // #21
  {
    id: 'poop',
    label: 'Kupa',
    overlay: '/tboi/decor/ov-poop.png',
    thumb: '/tboi/decor/th-poop.png',
  }, // #18
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
