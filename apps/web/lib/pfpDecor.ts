// Dekoracje avatara (pfp) — mały sprite/doodle przypięty w rogu zdjęcia profilowego.
// Wybierane w edytorze profilu (kim-jestem), zapisywane jako preferencja lokalna
// (localStorage `idx_pfp_decor`) i renderowane WSZĘDZIE, gdzie pokazywany jest avatar.

export type DecorId =
  'none' | 'fly' | 'spider' | 'blood' | 'heart' | 'bomb' | 'd6' | 'coin' | 'doodle'

export type Decor = {
  id: DecorId
  label: string
  src?: string // sprite z gry (public/tboi/…)
  d?: string // albo ścieżka SVG (odręczne doodle, currentColor)
}

// Kolejność = kolejność w pickerze. „Brak" pierwsze.
export const DECORATIONS: Decor[] = [
  { id: 'none', label: 'Brak' },
  { id: 'fly', label: 'Mucha', src: '/tboi/fly-big.png' },
  { id: 'spider', label: 'Pająk', src: '/tboi/items/collectibles/mutantspider.png' },
  { id: 'blood', label: 'Krew', src: '/tboi/blood-splatter.svg' },
  { id: 'heart', label: 'Serce', src: '/tboi/icons/heart.webp' },
  { id: 'bomb', label: 'Bomba', src: '/tboi/icons/bomb.webp' },
  { id: 'd6', label: 'D6', src: '/tboi/icons/d6.webp' },
  { id: 'coin', label: 'Moneta', src: '/tboi/icons/coin.webp' },
  { id: 'doodle', label: 'Doodle', d: 'M9 18c2.5 3.5 11.5 3.5 14 0M11 12h.02M21 12h.02' },
]

export const DEFAULT_DECOR: DecorId = 'none'

const MAP = new Map<DecorId, Decor>(DECORATIONS.map((d) => [d.id, d]))

/** Bezpieczne pobranie dekoracji po id (fallback = „Brak"). */
export function getDecor(id: string | null | undefined): Decor {
  return MAP.get(id as DecorId) ?? DECORATIONS[0]
}
