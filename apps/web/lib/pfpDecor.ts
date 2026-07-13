// Dekoracje ramki pfp (frame decorations) — nakładane na polaroid profilu.
//
// Każda dekoracja to nakładka PNG na WSPÓLNEJ kanwie (351×341 px w skali zrzutów, czyli
// 175,5×170,5 CSS px przy polaroidzie 92×104). Geometrię — skalę, przesunięcie i kontr-obrót
// przechylonej ramki — ustawia jedna klasa `.pfp-overlay` w globals.css, więc wszystkie
// dekoracje siadają tak jak na zdjęciach referencyjnych (frame_decoration*.png); zmierzony
// błąd pozycji to ułamek piksela.
//
// Sprity: death/brownie/deadgod/blood pochodzą z edytowanych sprite'ów użytkownika
// (edited_frame1–4), reszta z dumpu gry / wiki (klucz, moneta, serce, kupa, mucha, Steven,
// The Siren) — dopasowane do zdjęć skalą i pozycją.
//
// Część dekoracji jest ZABLOKOWANA — wymaga achievementu Steam (`unlock.ach` = displayName).

export type DecorId =
  | 'none'
  | 'death'
  | 'deadgod'
  | 'brownie'
  | 'steven'
  | 'siren'
  | 'coin'
  | 'heart'
  | 'blood'
  | 'key'
  | 'fly'
  | 'poop'

export type Decor = {
  id: DecorId
  label: string
  overlay?: string // nakładka na wspólnej kanwie (public/tboi/decor/ov-*.png)
  thumb?: string // ikona TYLKO na guziku w pickerze (nie ma wpływu na sprite na avatarze)
  thumbScale?: number // korekta wielkości ikony na guziku (1 = domyślna)
  unlock?: { ach: string; text: string } // wymagany achievement (displayName) + opis PL
}

// Kolejność = kolejność w pickerze. „Brak" pierwsze, potem odblokowywane, potem wolne.
export const DECORATIONS: Decor[] = [
  { id: 'none', label: 'Brak' },

  // ── Wymagają achievementu ──
  {
    id: 'death',
    label: 'Ultra Death',
    overlay: '/tboi/decor/ov-death.png',
    thumb: '/tboi/decor/th-death.png',
    unlock: { ach: "Death's Touch", text: 'Wymaga achievementu „Death’s Touch"' },
  },
  {
    id: 'deadgod',
    label: 'Dogma',
    overlay: '/tboi/decor/ov-deadgod.png',
    thumb: '/tboi/decor/th-deadgod.png',
    unlock: { ach: 'Dead God', text: 'Wymaga achievementu „Dead God"' },
  },
  {
    id: 'siren',
    label: 'The Siren',
    overlay: '/tboi/decor/ov-siren.png',
    thumb: '/tboi/decor/th-siren.png',
    unlock: { ach: 'Forgotten Lullaby', text: 'Wymaga achievementu „Forgotten Lullaby"' },
  },
  {
    id: 'brownie',
    label: 'Turdlet',
    overlay: '/tboi/decor/ov-brownie.png',
    thumb: '/tboi/decor/th-brownie.png',
    unlock: { ach: 'A Secret Exit', text: 'Wymaga achievementu „A Secret Exit"' },
  },
  {
    id: 'steven',
    label: 'Steven',
    overlay: '/tboi/decor/ov-steven.png',
    thumb: '/tboi/decor/th-steven.png',
    unlock: { ach: 'Little Steven', text: 'Wymaga achievementu „Little Steven"' },
  },

  // ── Wolne ──
  {
    id: 'coin',
    label: 'Moneta',
    overlay: '/tboi/decor/ov-coin.png',
    thumb: '/tboi/decor/th-coin.png',
    thumbScale: 1.2,
  },
  {
    id: 'heart',
    label: 'Serce',
    overlay: '/tboi/decor/ov-heart.png',
    thumb: '/tboi/decor/th-heart.png',
  },
  {
    id: 'blood',
    label: 'Krew',
    overlay: '/tboi/decor/ov-blood.png',
    thumb: '/tboi/decor/th-blood.png',
  },
  {
    id: 'key',
    label: 'Klucz',
    overlay: '/tboi/decor/ov-key.png',
    thumb: '/tboi/decor/th-key.png',
    thumbScale: 0.78,
  },
  { id: 'fly', label: 'Mucha', overlay: '/tboi/decor/ov-fly.png', thumb: '/tboi/decor/th-fly.png' },
  {
    id: 'poop',
    label: 'Kupa',
    overlay: '/tboi/decor/ov-poop.png',
    thumb: '/tboi/decor/th-poop.png',
  },
]

export const DEFAULT_DECOR: DecorId = 'none'

const MAP = new Map<DecorId, Decor>(DECORATIONS.map((d) => [d.id, d]))

// Stare id z poprzedniej wersji dekoracji (zapisane w localStorage u istniejących userów).
const ALIASY: Record<string, DecorId> = { bombblack: 'fly' }

/** Bezpieczne pobranie dekoracji po id (fallback = „Brak"). */
export function getDecor(id: string | null | undefined): Decor {
  const key = (ALIASY[id as string] ?? id) as DecorId
  return MAP.get(key) ?? DECORATIONS[0]
}

/** Czy dekoracja jest dostępna dla gracza (odblokowana albo bez wymagań). */
export function decorOdblokowana(d: Decor, odblokowane: Set<string>): boolean {
  return !d.unlock || odblokowane.has(d.unlock.ach)
}
