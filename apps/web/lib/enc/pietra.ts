/**
 * Rozdziały gry, po których filtrujemy bossów i przeciwników.
 *
 * W źródłowym JSON-ie (bossowie/przeciwnicy) NIE ma osobnego pola „piętro" — jest tylko
 * opis z wiki, który wymienia rozdziały słownie („appears in the Basement and the Caves").
 * Zamiast ręcznie oznaczać ~470 wpisów, wyciągamy rozdziały z tego opisu po nazwach własnych.
 *
 * Dobór słów jest CELOWO zachowawczy: tylko charakterystyczne nazwy pięter, żeby zwykłe słowa
 * nie dawały fałszywych trafień (stąd „the chest", nie „chest"; bez „void"/„home"/„hush",
 * które padają w opisach zachowań potworów).
 */
export type PietroId = 'basement' | 'caves' | 'depths' | 'womb' | 'koniec'

export const PIETRA: PietroId[] = ['basement', 'caves', 'depths', 'womb', 'koniec']

const SLOWA: Record<PietroId, string[]> = {
  basement: ['basement', 'cellar', 'downpour', 'dross'],
  caves: ['caves', 'catacombs', 'mines', 'ashpit'],
  depths: ['depths', 'necropolis', 'mausoleum', 'gehenna'],
  womb: ['womb', 'utero', 'corpse'],
  koniec: ['sheol', 'cathedral', 'dark room', 'the chest', 'delirium'],
}

/** Rozdziały wymienione w opisie (pusto, gdy żaden nie pada — wpis zostaje pod „Wszystkie"). */
export function pietraZOpisu(opis?: string | null): PietroId[] {
  if (!opis) return []
  const o = opis.toLowerCase()
  return PIETRA.filter((id) => SLOWA[id].some((s) => o.includes(s)))
}
