import type { SpriteName } from '@/components/Sprite'

/**
 * Sekcje Encyklopedii — jedno źródło prawdy dla hubu (/encyklopedia) i przyszłych podstron.
 * `href` mają tylko sekcje już zrobione; reszta renderuje się jako karta „Wkrótce".
 */
export type Sekcja = {
  slug: string
  label: string
  opis: string
  icon: SpriteName
  href?: string
}

export const SEKCJE: Sekcja[] = [
  {
    slug: 'przedmioty',
    label: 'Przedmioty',
    opis: 'Wszystkie itemy z jakością, tagami i radą „brać czy zostawić".',
    icon: 'advisor',
    href: '/encyklopedia/przedmioty',
  },
  {
    slug: 'trinkety',
    label: 'Trinkety',
    opis: 'Bibeloty, ich efekty i wartość w konkretnych buildach.',
    icon: 'foundsoul',
  },
  {
    slug: 'pickupy',
    label: 'Pickupy',
    opis: 'Serca, monety, klucze, bomby, karty, pigułki i runy.',
    icon: 'coin',
  },
  {
    slug: 'postacie',
    label: 'Postacie',
    opis: 'Statystyki startowe, przedmioty i sposób gry każdą postacią.',
    icon: 'chad',
  },
  {
    slug: 'transformacje',
    label: 'Transformacje',
    opis: 'Guppy, Conjoined i reszta — czego trzeba, żeby je złożyć.',
    icon: 'godhead',
  },
  {
    slug: 'pokoje-kostek',
    label: 'Pokoje kostek',
    opis: 'Co robi każda kropka na podłodze Dice Roomu.',
    icon: 'd6',
  },
  {
    slug: 'bossowie',
    label: 'Bossowie',
    opis: 'Ataki, wzorce i nagrody bossów na każdym piętrze.',
    icon: 'deadgod',
  },
  {
    slug: 'przeciwnicy',
    label: 'Przeciwnicy',
    opis: 'Zwykłe potwory, ich zachowanie i czym potrafią zaskoczyć.',
    icon: 'skull',
  },
]

/** Ile sekcji czeka jeszcze na treść (do podpisu w nagłówku hubu). */
export const SEKCJE_W_BUDOWIE = SEKCJE.filter((s) => !s.href).length
