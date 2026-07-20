import surowePostacie from './statyPostaci.json'
import soweItemy from './statyItemow.json'
import soweItemyKatalog from './itemy.json'
import type { ModyfikatorStatow, Stat, StatyBazowe } from '@isaacdex/core'
import type { Klucz, Tlumacz } from '../i18n/slownik'

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
export type ItemStaty = ModyfikatorStatow & { id: number; nazwa: string; jakosc?: number }

export const POSTACIE_STATY = surowePostacie as PostacStaty[]
/**
 * Jakość itemu (Q0–Q4) mieszka w katalogu Encyklopedii, a nie w tabeli statów — dopinamy ją
 * po `id`, żeby Kalkulator kolorował itemy tą samą skalą co reszta apki (161/161 trafień).
 */
const JAKOSC_PO_ID = new Map(
  (soweItemyKatalog as { id: number; jakosc?: number }[]).map((i) => [i.id, i.jakosc]),
)

export const ITEMY_STATY = (soweItemy as ItemStaty[])
  .slice()
  .map((i) => ({ ...i, jakosc: JAKOSC_PO_ID.get(i.id) }))
  .sort((a, b) => a.nazwa.localeCompare(b.nazwa))

/**
 * Kolejność i nazwy statów w tabeli (jak na ekranie postaci w grze).
 *
 * `label`/`opis` to KLUCZE słownika, nie gotowe napisy — stała modułowa nie ma jak zawołać
 * tłumacza, więc robi to Kalkulator przy renderze.
 */
export const STATY_OPIS: { stat: Stat; labelKlucz: Klucz; opisKlucz: Klucz }[] = [
  {
    stat: 'damage',
    labelKlucz: 'encyklopedia.kalkStatDamage',
    opisKlucz: 'encyklopedia.kalkStatDamageOpis',
  },
  {
    stat: 'tears',
    labelKlucz: 'encyklopedia.kalkStatTears',
    opisKlucz: 'encyklopedia.kalkStatTearsOpis',
  },
  {
    stat: 'speed',
    labelKlucz: 'encyklopedia.kalkStatSpeed',
    opisKlucz: 'encyklopedia.kalkStatSpeedOpis',
  },
  {
    stat: 'range',
    labelKlucz: 'encyklopedia.kalkStatRange',
    opisKlucz: 'encyklopedia.kalkStatRangeOpis',
  },
  {
    stat: 'shotSpeed',
    labelKlucz: 'encyklopedia.kalkStatShotSpeed',
    opisKlucz: 'encyklopedia.kalkStatShotSpeedOpis',
  },
  {
    stat: 'luck',
    labelKlucz: 'encyklopedia.kalkStatLuck',
    opisKlucz: 'encyklopedia.kalkStatLuckOpis',
  },
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

/**
 * Krótki opis wpływu itemu — np. „+0.5 obrażeń · ×1.5 obrażeń".
 *
 * Osobne klucze niż nagłówki tabeli, bo polski wymaga tu dopełniacza („Obrażenia" w główce,
 * ale „+0.5 obrażeń" w opisie); po angielsku obie formy brzmią tak samo.
 */
const NAZWY_STATOW: Record<Stat, Klucz> = {
  damage: 'encyklopedia.modDamage',
  tears: 'encyklopedia.modTears',
  speed: 'encyklopedia.modSpeed',
  range: 'encyklopedia.modRange',
  shotSpeed: 'encyklopedia.modShotSpeed',
  luck: 'encyklopedia.modLuck',
}

export function opisModyfikatora(i: ItemStaty, t: Tlumacz): string {
  const czesci: string[] = []
  for (const [stat, wartosc] of Object.entries(i.plaskie ?? {})) {
    const znak = wartosc > 0 ? '+' : ''
    czesci.push(`${znak}${wartosc} ${t(NAZWY_STATOW[stat as Stat])}`)
  }
  for (const [stat, wartosc] of Object.entries(i.mnozniki ?? {})) {
    czesci.push(`×${wartosc} ${t(NAZWY_STATOW[stat as Stat])}`)
  }
  return czesci.join(' · ')
}
