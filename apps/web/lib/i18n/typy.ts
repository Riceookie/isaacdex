import type { Jezyk } from './jezyk'

/**
 * Jeden komunikat = jeden obiekt z KOMPLETEM języków.
 *
 * Języki stoją obok siebie, a nie w osobnych plikach `en.ts` / `pl.ts`, i to jest celowe:
 * przy dwóch plikach każde dodanie tekstu trzeba zrobić w dwóch miejscach, a rozjazd
 * (klucz dodany tylko po jednej stronie) wychodzi dopiero w przeglądarce. Tutaj brakująca
 * wersja to błąd kompilacji.
 *
 * Forma mnoga jest osobnym wariantem, bo polski ma trzy formy (1 wpis / 2 wpisy / 5 wpisów),
 * a angielski dwie — `Intl.PluralRules` wybiera właściwą (patrz `tlumacz`).
 */
export type Komunikat = Record<Jezyk, string>

export type KomunikatMnogi = Record<
  Jezyk,
  { one: string; few?: string; many?: string; other: string }
>

export type Wpis = Komunikat | KomunikatMnogi

export type Przestrzen = Record<string, Wpis>

export function czyMnogi(w: Wpis): w is KomunikatMnogi {
  return typeof (w as KomunikatMnogi).en === 'object'
}
