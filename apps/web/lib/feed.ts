// Wspólne źródło feedu aktywności (DEMO). Używane przez Pulpit (główna kolumna)
// i stronę Znajomi. Realny feed (konta + obserwowanie + Supabase Realtime) = projekt
// końcowy — tu statyczne, ale bogate wpisy w klimacie Isaaca.

export type FeedWpis =
  | {
      typ: 'unlock'
      user: string
      postac: string
      czas: string
      lajki: number
      komentarze: number
    }
  | {
      typ: 'boss'
      user: string
      postac: string
      czas: string
      boss: string
      jako: string
      lajki: number
      komentarze: number
    }
  | {
      typ: 'run'
      user: string
      postac: string
      czas: string
      opis: string
      itemy: string[]
      lajki: number
      komentarze: number
    }

/** Kolor nicku autora (jak role-color na Discordzie). */
export const KOLOR_AUTORA: Record<string, string> = {
  VoidKing: '#8a6fd6',
  Lilith: '#b06ad6',
  Jorge: '#c98a4e',
  Ananas: '#e0b64c',
  BasementDweller: '#e5544b',
  TaintedLostMain: '#7fa6c9',
  Sarah: '#5bbf6a',
  Mike: '#e5544b',
  Kuba: '#4ea3c9',
  Nina: '#d67ba8',
}

// Kolejność = chronologia (najnowsze u góry). Miks typów, żeby feed „żył".
export const FEED: FeedWpis[] = [
  {
    typ: 'run',
    user: 'Jorge',
    postac: 'Azazel',
    czas: '4 min temu',
    opis: 'wrzucił połamany run',
    itemy: ['Sacred Heart', 'Brimstone', 'Tech X'],
    lajki: 128,
    komentarze: 24,
  },
  {
    typ: 'unlock',
    user: 'VoidKing',
    postac: 'Isaac',
    czas: '12 min temu',
    lajki: 32,
    komentarze: 8,
  },
  {
    typ: 'boss',
    user: 'Lilith',
    postac: 'The Lost',
    czas: '38 min temu',
    boss: 'Delirium',
    jako: 'Tainted Lost',
    lajki: 54,
    komentarze: 11,
  },
  {
    typ: 'run',
    user: 'BasementDweller',
    postac: 'Cain',
    czas: '1 godz temu',
    opis: 'zbudował guppy w Basement 2',
    itemy: ['Ipecac', "Mom's Knife", 'Incubus'],
    lajki: 67,
    komentarze: 9,
  },
  {
    typ: 'unlock',
    user: 'Sarah',
    postac: 'Bethany',
    czas: '2 godz temu',
    lajki: 6,
    komentarze: 1,
  },
  {
    typ: 'boss',
    user: 'Mike',
    postac: 'Azazel',
    czas: '3 godz temu',
    boss: 'Mega Satan',
    jako: 'Azazel',
    lajki: 27,
    komentarze: 4,
  },
  {
    typ: 'run',
    user: 'TaintedLostMain',
    postac: 'The Lost',
    czas: 'wczoraj',
    opis: 'przeszedł Boss Rush bez itemów',
    itemy: ['Epic Fetus', 'Polyphemus'],
    lajki: 41,
    komentarze: 15,
  },
  {
    typ: 'unlock',
    user: 'Nina',
    postac: 'Eden',
    czas: 'wczoraj',
    lajki: 3,
    komentarze: 0,
  },
]
