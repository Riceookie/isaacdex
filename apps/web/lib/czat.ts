import type { SpriteName } from '@/components/Sprite'

/**
 * Czat piwnicy. Trzy kanały (globalny, znajomi, ogłoszenia) plus prywatne rozmowy
 * ze znajomymi — zamiast tematycznych „pokojów", które tylko rozpraszały.
 *
 * Wiadomości są DEMO (bez backendu), ale rozmówcy to prawdziwi gracze z bazy — te same
 * nicki, kolory i pfp co u Znajomych.
 */

export type TypKanalu = 'global' | 'znajomi' | 'ogloszenia' | 'dm'

export type Kanal = {
  slug: string
  nazwa: string
  ikona: SpriteName
  /** Zdanie pod nazwą — klimat, nie instrukcja obsługi. */
  opis: string
  typ: TypKanalu
  /** Ogłoszenia czyta się, nie pisze — mówi tu tylko Dogma. */
  tylkoOdczyt?: boolean
}

export const KANALY: Kanal[] = [
  {
    slug: 'piwnica',
    nazwa: 'piwnica',
    ikona: 'fly',
    opis: 'Czat globalny. Krew, łzy i skill issue.',
    typ: 'global',
  },
  {
    slug: 'znajomi',
    nazwa: 'znajomi',
    ikona: 'friends',
    opis: 'Tylko Twoi znajomi. Sami swoi.',
    typ: 'znajomi',
  },
  {
    slug: 'ogloszenia',
    nazwa: 'ogłoszenia',
    ikona: 'dadsnote',
    opis: 'Tu mówi tylko Dogma. Ty słuchasz.',
    typ: 'ogloszenia',
    tylkoOdczyt: true,
  },
]

export const DOMYSLNY_KANAL = KANALY[0].slug

/** Kanał prywatny z konkretnym graczem (id: „dm:Nick"). */
export const dmSlug = (nick: string) => `dm:${nick}`
export const nickZDm = (slug: string) => (slug.startsWith('dm:') ? slug.slice(3) : null)

export type Wiad = {
  id: string
  autor: string
  /** Godzina jako gotowy tekst („14:32") — nie Date, żeby serwer i klient nie różniły się strefą. */
  czas: string
  tekst: string[]
  /** Wpis Dogmy — krwawa, „bossowa" ramka zamiast zwykłego dymka. */
  bot?: boolean
  reakcje?: { ikona: SpriteName; ile: number }[]
}

export const WIADOMOSCI: Record<string, Wiad[]> = {
  piwnica: [
    {
      id: 'p1',
      autor: 'VoidKing',
      czas: '14:32',
      tekst: ['właśnie miałem najbardziej połamany run w życiu', 'brimstone + tech x + ipecac'],
      reakcje: [
        { ikona: 'heart', ile: 4 },
        { ikona: 'skull', ile: 1 },
      ],
    },
    { id: 'p2', autor: 'Chomik', czas: '14:33', tekst: ['seed albo się nie liczy'] },
    {
      id: 'p3',
      autor: 'VoidKing',
      czas: '14:33',
      tekst: ['KJ4D 82LS', 'baw się dobrze. albo i nie'],
      reakcje: [{ ikona: 'coin', ile: 2 }],
    },
    {
      id: 'p4',
      autor: 'Lilith',
      czas: '14:34',
      tekst: ['na tym seedzie też miałam sacred heart', 'gra wie, czego chcemy'],
      reakcje: [{ ikona: 'heart', ile: 7 }],
    },
    {
      id: 'p5',
      autor: 'Klucznik',
      czas: '14:35',
      tekst: ['zrestartowałem run, bo nie dostałem Brimstone w pierwszym pokoju'],
      reakcje: [{ ikona: 'skull', ile: 6 }],
    },
    { id: 'p6', autor: 'Sadza', czas: '14:36', tekst: ['we ball'] },
  ],
  znajomi: [
    {
      id: 'z1',
      autor: 'Mama',
      czas: '13:10',
      tekst: ['12 minut na Boss Rushu. przyjmuję gratulacje'],
      reakcje: [{ ikona: 'trophy', ile: 3 }],
    },
    {
      id: 'z2',
      autor: 'Jorge',
      czas: '13:22',
      tekst: ['zginąłem na Delirium mając 3 serca', 'nie chcę o tym rozmawiać'],
      reakcje: [{ ikona: 'skull', ile: 5 }],
    },
    { id: 'z3', autor: 'Chomik', czas: '13:40', tekst: ['ktoś leci na daily? zostało 6 godzin'] },
    {
      id: 'z4',
      autor: 'VoidKing',
      czas: '13:41',
      tekst: ['jestem. ale gram Apollyonem, więc i tak zjem cały pokój'],
      reakcje: [{ ikona: 'heart', ile: 2 }],
    },
  ],
  ogloszenia: [
    {
      id: 'g1',
      autor: 'Dogma',
      czas: '09:00',
      bot: true,
      tekst: ['Wyzwanie dnia: Eden, tryb Normal. 681 osób już zginęło.', 'Seed dnia: 53ZB LAKT.'],
      reakcje: [{ ikona: 'trophy', ile: 14 }],
    },
    {
      id: 'g2',
      autor: 'Dogma',
      czas: '11:20',
      bot: true,
      tekst: ['Nowe achievementy w Encyklopedii. Nadal ich nie masz.'],
      reakcje: [{ ikona: 'skull', ile: 8 }],
    },
    {
      id: 'g3',
      autor: 'Dogma',
      czas: '12:45',
      bot: true,
      tekst: ['Przypomnienie: secret room istnieje. Nie znajdziesz go tutaj.'],
    },
  ],
}

/**
 * Prywatna rozmowa ze znajomym. Treść dobierana z puli po nicku (deterministycznie),
 * więc każdy znajomy ma swoją rozmowę i zawsze tę samą.
 */
const ROZMOWY: { czas: string; odNiego: string[]; odeMnie?: string }[][] = [
  [
    { czas: '12:04', odNiego: ['masz chwilę? mam pytanie o build'], odeMnie: 'wal śmiało' },
    { czas: '12:06', odNiego: ['brimstone + sacred heart. brać czy zostawić?'] },
  ],
  [
    { czas: '18:31', odNiego: ['widziałem twój run. bolało'], odeMnie: 'nie mów nic' },
    { czas: '18:32', odNiego: ['nic nie mówię'] },
  ],
  [
    { czas: '20:15', odNiego: ['lecisz na daily?'], odeMnie: 'za 10 minut' },
    { czas: '20:16', odNiego: ['czekam. tym razem nie zgiń na Mamie'] },
  ],
  [
    { czas: '09:48', odNiego: ['znalazłem secret room za pierwszym razem'] },
    { czas: '09:49', odNiego: ['nie pytaj jak. i tak nie uwierzysz'] },
  ],
]

const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function rozmowaZ(nick: string, mojNick: string): Wiad[] {
  const szablon = ROZMOWY[hash('dm-' + nick) % ROZMOWY.length]
  const wiad: Wiad[] = []
  szablon.forEach((w, i) => {
    wiad.push({ id: `dm-${nick}-${i}-a`, autor: nick, czas: w.czas, tekst: w.odNiego })
    if (w.odeMnie) {
      wiad.push({ id: `dm-${nick}-${i}-b`, autor: mojNick, czas: w.czas, tekst: [w.odeMnie] })
    }
  })
  return wiad
}

/** Reakcje pod wiadomością — pickupy zamiast emoji. */
export const REAKCJE: SpriteName[] = ['heart', 'coin', 'skull', 'trophy']

// ── Kto jest w piwnicy: status + jego ikona ───────────────────────────────────

const STATUSY: { tekst: string; ikona: SpriteName }[] = [
  { tekst: 'krwawi na Sheol', ikona: 'skull' },
  { tekst: 'ucieka przed Mamą', ikona: 'bomb' },
  { tekst: 'kupuje w sklepie', ikona: 'coin' },
  { tekst: 'grinduje Dead Goda', ikona: 'deadgod' },
  { tekst: 'resetuje seed', ikona: 'd6' },
  { tekst: 'płacze w Basement I', ikona: 'heart' },
  { tekst: 'walczy z Delirium', ikona: 'godhead' },
  { tekst: 'przegląda itemy', ikona: 'book' },
  { tekst: 'szuka secret roomu', ikona: 'membercard' },
]

export function statusGracza(nick: string): { tekst: string; ikona: SpriteName } {
  return STATUSY[hash('status-' + nick) % STATUSY.length]
}

/** Online = mniej więcej dwie trzecie graczy; reszta „zginęła" (offline). */
export function czyOnline(nick: string): boolean {
  return hash('online-' + nick) % 3 !== 0
}

// ── Kwestie dla familiara z górnego paska (jednego, tego z TopBara) ───────────

const PO_WYSLANIU = [
  'Piwnica słucha.',
  'Ładnie powiedziane. Nikt nie odpowie.',
  'Zapisane. Na zawsze.',
  'Odważne. Zobaczymy.',
  'Ktoś to przeczyta. Kiedyś.',
]

const W_KANALE: Record<string, string> = {
  piwnica: 'Cała piwnica cię słyszy.',
  znajomi: 'Tu są tylko swoi. Na razie.',
  ogloszenia: 'Dogma mówi. Ty słuchasz.',
}

/**
 * Co familiar ma powiedzieć na zdarzenie w czacie. Sam tekst — wysyłką zajmuje się
 * `powiedz()` z lib/companionGlos, a wypisuje go maskotka w TopBarze.
 */
export function kwestiaCzatu(typ: 'wyslano' | 'kanal', co: string, licznik: number): string {
  if (typ === 'wyslano') return PO_WYSLANIU[licznik % PO_WYSLANIU.length]
  const nick = nickZDm(co)
  if (nick) return `Piszesz do ${nick}. Tylko wy dwoje.`
  return W_KANALE[co] ?? 'Idziemy dalej.'
}
