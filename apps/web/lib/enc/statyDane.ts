import surowePostacie from './statyPostaci.json'
import soweItemy from './statyItemow.json'
import type { ModyfikatorStatow, Stat, StatyBazowe } from '@isaacdex/core'

/**
 * Dane do kalkulatora statystyk.
 *
 * Staty bazowe pochodzą z DWÓCH tabel na wiki (strona „Characters"): bazowej i splugawionych.
 * Tabele są generowane szablonem, więc widać je dopiero w wyrenderowanym HTML-u.
 *
 * WAŻNE: postacie z formami zajmują w tabeli po dwie kolumny (Judas + Dark Judas,
 * Lazarus + Lazarus Risen, The Forgotten + The Soul, Jacob + Esau, Tainted Lazarus +
 * Dead Tainted Lazarus, Tainted Forgotten + Tainted Soul) i KAŻDA forma ma własne staty —
 * dlatego są w kalkulatorze osobno, a nie sklejone w jedną postać.
 *
 * Modyfikatory itemów są wyparsowane z sekcji „Effects" na wiki (np. „+0.7 tears",
 * „×1.5 damage"). Itemy, które nie podają liczb (np. Brimstone — zmienia broń, nie staty),
 * po prostu nie mają wpisu.
 */
export type PostacStaty = StatyBazowe & {
  nazwa: string
  /** Której postaci portret pokazać — formy pożyczają portret „rodzica" (Esau → Jacob & Esau). */
  ikona: string
  tainted: boolean
}
export type ItemStaty = ModyfikatorStatow & { id: number; nazwa: string }

export const POSTACIE_STATY = surowePostacie as PostacStaty[]
export const ITEMY_STATY = (soweItemy as ItemStaty[])
  .slice()
  .sort((a, b) => a.nazwa.localeCompare(b.nazwa))

/** Kolejność i nazwy statów w tabeli (jak na ekranie postaci w grze). */
export const STATY_OPIS: { stat: Stat; label: string; opis: string }[] = [
  { stat: 'damage', label: 'Obrażenia', opis: 'Ile zabiera jedna łza.' },
  { stat: 'tears', label: 'Łzy', opis: 'Szybkostrzelność — łzy na sekundę.' },
  { stat: 'speed', label: 'Szybkość', opis: 'Jak szybko Isaac się porusza.' },
  { stat: 'range', label: 'Zasięg', opis: 'Jak daleko lecą łzy.' },
  { stat: 'shotSpeed', label: 'Prędkość łez', opis: 'Jak szybko lecą łzy.' },
  { stat: 'luck', label: 'Szczęście', opis: 'Podbija szanse efektów losowych.' },
]

/** Maksimum skali paska dla każdego statu (do wizualizacji, nie do liczenia). */
export const SKALA: Record<Stat, number> = {
  damage: 20,
  tears: 8,
  speed: 2,
  range: 20,
  shotSpeed: 3,
  luck: 15,
}

/** Krótki opis wpływu itemu — np. „+0.5 obrażeń · ×1.5 obrażeń". */
const NAZWY_STATOW: Record<Stat, string> = {
  damage: 'obrażeń',
  tears: 'łez',
  speed: 'szybkości',
  range: 'zasięgu',
  shotSpeed: 'prędkości łez',
  luck: 'szczęścia',
}

export function opisModyfikatora(i: ItemStaty): string {
  const czesci: string[] = []
  for (const [stat, wartosc] of Object.entries(i.plaskie ?? {})) {
    const znak = wartosc > 0 ? '+' : ''
    czesci.push(`${znak}${wartosc} ${NAZWY_STATOW[stat as Stat]}`)
  }
  for (const [stat, wartosc] of Object.entries(i.mnozniki ?? {})) {
    czesci.push(`×${wartosc} ${NAZWY_STATOW[stat as Stat]}`)
  }
  return czesci.join(' · ')
}
