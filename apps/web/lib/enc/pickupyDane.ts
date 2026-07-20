import surowe from './pickupy.json'
import type { Klucz, Tlumacz } from '../i18n/slownik'

/**
 * Pickupy (serca, monety, klucze, bomby, baterie, skrzynie, worki) — wyciągnięte z tabel
 * wiki (nazwa, obrazek, wartość, efekt, sposób odblokowania, szansa wypadnięcia).
 * Ikony pobrane do public/tboi/pickupy/.
 */
export type PickupDane = {
  rodzina: string
  nazwa: string
  ikona?: string | null
  wartosc?: string | null // ile daje (np. „1", „6 ładunków")
  opis?: string | null
  odblokowanie?: string | null
  szansa?: string | null // szansa wypadnięcia po wyczyszczeniu pokoju
}

export const PICKUPY = surowe as PickupDane[]

/**
 * Rodziny w kolejności jak w grze (do chipów filtra).
 *
 * Wartości są takie same jak pole `rodzina` w JSON-ie — to one łączą pickup z filtrem.
 * Zostają po polsku jako IDENTYFIKATOR danych; na ekran idzie `etykietaRodziny`.
 */
export const RODZINY = ['Serca', 'Monety', 'Klucze', 'Bomby', 'Baterie', 'Skrzynie', 'Worki']

const KLUCZE_RODZIN: Record<string, Klucz> = {
  Serca: 'encyklopedia.rodzinaSerca',
  Monety: 'encyklopedia.rodzinaMonety',
  Klucze: 'encyklopedia.rodzinaKlucze',
  Bomby: 'encyklopedia.rodzinaBomby',
  Baterie: 'encyklopedia.rodzinaBaterie',
  Skrzynie: 'encyklopedia.rodzinaSkrzynie',
  Worki: 'encyklopedia.rodzinaWorki',
}

/** Nazwa rodziny na ekran (chip filtra, znacznik w detalu). */
export function etykietaRodziny(r: string, t: Tlumacz): string {
  const k = KLUCZE_RODZIN[r]
  return k ? t(k) : r
}

/** Slug rodziny do id filtra (bez polskich znaków). */
export function slugRodziny(r: string): string {
  return r
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')
}
