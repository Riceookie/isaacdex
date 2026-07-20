import { JEZYK_DOMYSLNY, type Jezyk } from './jezyk'
import { czyMnogi, type Przestrzen } from './typy'
import { ustawienia } from './slowniki/ustawienia'
import { wspolne } from './slowniki/wspolne'
import { nawigacja } from './slowniki/nawigacja'
import { czat } from './slowniki/czat'
import { companion } from './slowniki/companion'
import { klimat } from './slowniki/klimat'
import { profil } from './slowniki/profil'
import { spolecznosc } from './slowniki/spolecznosc'
import { kolekcja } from './slowniki/kolekcja'
import { encyklopedia } from './slowniki/encyklopedia'
import { konto } from './slowniki/konto'

/**
 * Wszystkie przestrzenie nazw słownika. Każdy obszar apki ma swój plik — dzięki temu
 * tłumaczenia da się dokładać równolegle, bez ciągłych konfliktów w jednym wielkim pliku.
 */
export const SLOWNIK = {
  wspolne,
  ustawienia,
  nawigacja,
  czat,
  companion,
  klimat,
  profil,
  spolecznosc,
  kolekcja,
  encyklopedia,
  konto,
} satisfies Record<string, Przestrzen>

type Slownik = typeof SLOWNIK

/** `'ustawienia.jezykNaglowek'` — klucze liczone z samego słownika, więc literówka nie przejdzie. */
export type Klucz = {
  [P in keyof Slownik]: `${P & string}.${keyof Slownik[P] & string}`
}[keyof Slownik]

export type Zmienne = Record<string, string | number>

/** Podmiana `{nick}` na wartość. Brakująca zmienna zostaje w tekście — widać ją od razu. */
function wstaw(tekst: string, zmienne?: Zmienne): string {
  if (!zmienne) return tekst
  return tekst.replace(/\{(\w+)\}/g, (calosc, nazwa) =>
    nazwa in zmienne ? String(zmienne[nazwa]) : calosc,
  )
}

/**
 * Tłumacz dla danego języka.
 *
 * Brakujący klucz NIE wywala widoku — wraca sam klucz. To świadome: apka ma setki tekstów,
 * a biały ekran przez jedną literówkę w kluczu jest gorszy niż widoczne „czat.wyslij".
 *
 * `liczba` włącza formy mnogie przez `Intl.PluralRules`: polski ma trzy (1 wpis / 2 wpisy /
 * 5 wpisów), angielski dwie. Bez tego każdy licznik w interfejsie brzmiałby jak „5 wpis".
 */
export function zrobTlumacza(jezyk: Jezyk) {
  const zasady = new Intl.PluralRules(jezyk === 'pl' ? 'pl-PL' : 'en-US')

  return function t(klucz: Klucz, zmienne?: Zmienne & { liczba?: number }): string {
    const [przestrzen, nazwa] = klucz.split('.') as [keyof Slownik, string]
    const wpis = (SLOWNIK[przestrzen] as Przestrzen | undefined)?.[nazwa]
    if (!wpis) return klucz

    if (czyMnogi(wpis)) {
      const formy = wpis[jezyk] ?? wpis[JEZYK_DOMYSLNY]
      const liczba = zmienne?.liczba ?? 0
      const forma = zasady.select(liczba) as 'one' | 'few' | 'many' | 'other'
      return wstaw(formy[forma] ?? formy.other, zmienne)
    }

    return wstaw(wpis[jezyk] ?? wpis[JEZYK_DOMYSLNY], zmienne)
  }
}

export type Tlumacz = ReturnType<typeof zrobTlumacza>
