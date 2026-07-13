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
  href: string
  /** Ma realne dane (reszta to zaślepki „wkrótce"). */
  gotowe?: boolean
}

export const SEKCJE: Sekcja[] = [
  {
    slug: 'przedmioty',
    label: 'Przedmioty',
    opis: 'Wszystkie itemy z jakością, tagami i radą „brać czy zostawić".',
    icon: 'advisor',
    href: '/encyklopedia/przedmioty',
    gotowe: true,
  },
  {
    slug: 'trinkety',
    label: 'Trinkety',
    opis: 'Bibeloty, ich efekty i sposób odblokowania.',
    icon: 'foundsoul',
    href: '/encyklopedia/trinkety',
    gotowe: true,
  },
  {
    slug: 'pickupy',
    label: 'Pickupy',
    opis: 'Serca, monety, klucze, bomby, baterie, skrzynie i worki.',
    icon: 'coin',
    href: '/encyklopedia/pickupy',
    gotowe: true,
  },
  {
    slug: 'postacie',
    label: 'Postacie',
    opis: 'Zdrowie, itemy startowe, birthright i Twój postęp marek.',
    icon: 'chad',
    href: '/encyklopedia/postacie',
    gotowe: true,
  },
  {
    slug: 'transformacje',
    label: 'Transformacje',
    opis: 'Guppy, Beelzebub i reszta — cały zestaw itemów każdej przemiany.',
    icon: 'godhead',
    href: '/encyklopedia/transformacje',
    gotowe: true,
  },
  {
    slug: 'pokoje-kostek',
    label: 'Pokoje kostek',
    opis: 'Co robi każda liczba oczek na podłodze Dice Roomu.',
    icon: 'd6',
    href: '/encyklopedia/pokoje-kostek',
    gotowe: true,
  },
  {
    slug: 'bossowie',
    label: 'Bossowie',
    opis: '103 bossów z portretami, zdrowiem i opisem.',
    icon: 'deadgod',
    href: '/encyklopedia/bossowie',
    gotowe: true,
  },
  {
    slug: 'przeciwnicy',
    label: 'Przeciwnicy',
    opis: '367 potworów: zdrowie, obrażenia i zachowanie.',
    icon: 'skull',
    href: '/encyklopedia/przeciwnicy',
    gotowe: true,
  },
]

/** Ile sekcji czeka jeszcze na treść (do podpisu w nagłówku hubu). */
export const SEKCJE_W_BUDOWIE = SEKCJE.filter((s) => !s.gotowe).length
