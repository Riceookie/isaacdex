import manifest from './item-sprites.json'

// Mapa slug → collectible/trinket id, wygenerowana z assetów gry
// (skrypt scripts/copy-item-sprites.mjs). Sprite'y leżą w public/tboi/items/.
const collectible = manifest.collectible as Record<string, number>
const trinket = manifest.trinket as Record<string, number>
const collectibleById = manifest.collectibleById as Record<string, string>
const trinketById = manifest.trinketById as Record<string, string>

const FALLBACK = '/tboi/items/questionmark.png'

/** Ścieżka sprite'a po id gry (Item.idW). Najpewniejszy sposób — bez zgadywania po nazwie. */
export function itemSpritePathById(idW: number | null | undefined, typ?: string): string | null {
  if (idW == null) return null
  const trinketMode = typ === 'TRINKET'
  const slug = (trinketMode ? trinketById : collectibleById)[String(idW)]
  if (!slug) return null
  return `/tboi/items/${trinketMode ? 'trinkets' : 'collectibles'}/${slug}.png`
}

/** Nazwa itemu → slug pliku (jak w nazwach sprite'ów: bez spacji, apostrofów, itp.). */
export function slugItemu(nazwa: string): string {
  return nazwa.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Ścieżka do sprite'a itemu po jego nazwie. Radzi sobie z rozbieżnością prefiksu
 * „The" (np. seed „Sad Onion" vs asset „The Sad Onion"). Gdy brak — questionmark.
 */
export function itemSpritePath(nazwa: string): string {
  const base = slugItemu(nazwa)
  const kandydaci = [base, 'the' + base, base.replace(/^the/, '')]
  for (const s of kandydaci) {
    if (s in collectible) return `/tboi/items/collectibles/${s}.png`
    if (s in trinket) return `/tboi/items/trinkets/${s}.png`
  }
  return FALLBACK
}

/** Czy dla nazwy istnieje prawdziwy sprite (nie fallback). */
export function maSprite(nazwa: string): boolean {
  return itemSpritePath(nazwa) !== FALLBACK
}
