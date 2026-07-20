import type { Klucz } from './i18n/slownik'

/**
 * Sekcje Encyklopedii — jedno źródło prawdy dla hubu (/encyklopedia) i przyszłych podstron.
 * `href` mają tylko sekcje już zrobione; reszta renderuje się jako karta „Wkrótce".
 *
 * Ikona jest ŚCIEŻKĄ do sprite'a, nie nazwą z rejestru `Sprite`: każdy dział ma pokazywać
 * swojego reprezentanta (Binge Eater, Monstro, Gaper…), a rejestr trzyma ikonografię
 * interfejsu i puchnąłby o wpisy używane w dokładnie jednym miejscu.
 *
 * Nazwa i opis działu to KLUCZE słownika, nie gotowe napisy: `SEKCJE` jest stałą modułową,
 * a tłumacz istnieje dopiero w komponencie. Hub tłumaczy je przy renderze.
 */
export type Sekcja = {
  slug: string
  /** Klucze słownika — moduł z danymi nie ma jak zawołać tłumacza, robi to hub. */
  labelKlucz: Klucz
  opisKlucz: Klucz
  /** Ścieżka do sprite'a w public/tboi. */
  ikona: string
  href: string
  /** Ma realne dane (reszta to zaślepki „wkrótce"). */
  gotowe?: boolean
}

export const SEKCJE: Sekcja[] = [
  {
    slug: 'przedmioty',
    labelKlucz: 'encyklopedia.dzialPrzedmioty',
    opisKlucz: 'encyklopedia.dzialPrzedmiotyOpis',
    ikona: '/tboi/items/collectibles/bingeeater.png', // Binge Eater
    href: '/encyklopedia/przedmioty',
    gotowe: true,
  },
  {
    slug: 'trinkety',
    labelKlucz: 'encyklopedia.dzialTrinkety',
    opisKlucz: 'encyklopedia.dzialTrinketyOpis',
    ikona: '/tboi/items/trinkets/swallowedpenny.png', // Swallowed Penny
    href: '/encyklopedia/trinkety',
    gotowe: true,
  },
  {
    slug: 'pickupy',
    labelKlucz: 'encyklopedia.dzialPickupy',
    opisKlucz: 'encyklopedia.dzialPickupyOpis',
    ikona: '/tboi/pickupy/red-heart.png', // Red Heart
    href: '/encyklopedia/pickupy',
    gotowe: true,
  },
  {
    slug: 'postacie',
    labelKlucz: 'encyklopedia.dzialPostacie',
    opisKlucz: 'encyklopedia.dzialPostacieOpis',
    ikona: '/tboi/chars/isaac.webp', // Isaac
    href: '/encyklopedia/postacie',
    gotowe: true,
  },
  {
    slug: 'transformacje',
    labelKlucz: 'encyklopedia.dzialTransformacje',
    opisKlucz: 'encyklopedia.dzialTransformacjeOpis',
    ikona: '/tboi/transformacje/guppy.png', // Guppy
    href: '/encyklopedia/transformacje',
    gotowe: true,
  },
  {
    slug: 'pokoje-kostek',
    labelKlucz: 'encyklopedia.dzialPokojeKostek',
    opisKlucz: 'encyklopedia.dzialPokojeKostekOpis',
    ikona: '/tboi/items/collectibles/dice.png', // The D6
    href: '/encyklopedia/pokoje-kostek',
    gotowe: true,
  },
  {
    slug: 'bossowie',
    labelKlucz: 'encyklopedia.dzialBossowie',
    opisKlucz: 'encyklopedia.dzialBossowieOpis',
    ikona: '/tboi/bossowie/monstro.png', // Monstro
    href: '/encyklopedia/bossowie',
    gotowe: true,
  },
  {
    slug: 'przeciwnicy',
    labelKlucz: 'encyklopedia.dzialPrzeciwnicy',
    opisKlucz: 'encyklopedia.dzialPrzeciwnicyOpis',
    ikona: '/tboi/przeciwnicy/gaper.png', // Gaper
    href: '/encyklopedia/przeciwnicy',
    gotowe: true,
  },
]

/** Ile sekcji czeka jeszcze na treść (do podpisu w nagłówku hubu). */
export const SEKCJE_W_BUDOWIE = SEKCJE.filter((s) => !s.gotowe).length
