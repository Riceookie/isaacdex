import surowe from './pickupy.json'

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

/** Rodziny w kolejności jak w grze (do chipów filtra). */
export const RODZINY = ['Serca', 'Monety', 'Klucze', 'Bomby', 'Baterie', 'Skrzynie', 'Worki']

/** Slug rodziny do id filtra (bez polskich znaków). */
export function slugRodziny(r: string): string {
  return r
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')
}
