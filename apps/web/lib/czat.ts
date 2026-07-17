import type { SpriteName } from '@/components/Sprite'

/**
 * Czat piwnicy. Dwa kanały publiczne (globalny i ogłoszenia) plus prywatne rozmowy
 * ze znajomymi — zamiast tematycznych „pokojów", które tylko rozpraszały.
 *
 * Wiadomości są PRAWDZIWE: leżą w tabeli `Wiadomosc`, przeżywają odświeżenie i dolatują
 * do wszystkich w kanale przez Supabase Realtime (patrz components/CzatWidok.tsx).
 * Wyjątkiem są ogłoszenia — to kanał bota (Dogma), czyli treść redakcyjna, a nie rozmowa;
 * dlatego jako jedyny jest wpisany w kod i tylko do odczytu.
 */

export type TypKanalu = 'global' | 'ogloszenia' | 'dm'

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
    slug: 'ogloszenia',
    nazwa: 'ogłoszenia',
    ikona: 'dadsnote',
    opis: 'Tu mówi tylko Dogma. Ty słuchasz.',
    typ: 'ogloszenia',
    tylkoOdczyt: true,
  },
]

export const DOMYSLNY_KANAL = KANALY[0].slug

/** Kanał prywatny w interfejsie („dm:Nick") — po nicku, bo tym operuje UI. */
export const dmSlug = (nick: string) => `dm:${nick}`
export const nickZDm = (slug: string) => (slug.startsWith('dm:') ? slug.slice(3) : null)

/**
 * Kanał prywatny W BAZIE — liczony z pary ID, zawsze mniejsze pierwsze („dm:3-17").
 * Po ID, nie po nicku: nick da się zmienić i rozmowa by się urwała. Kolejność jest
 * ustalona, bo inaczej ta sama para miałaby dwa kanały — zależnie od tego, kto pisze.
 */
export const kanalDm = (a: number, b: number) => `dm:${Math.min(a, b)}-${Math.max(a, b)}`

export type Wiad = {
  id: string
  autor: string
  /** Godzina jako gotowy tekst („14:32") — patrz `godzina()`. */
  czas: string
  tekst: string[]
  /** Wpis Dogmy — krwawa, „bossowa" ramka zamiast zwykłego dymka. */
  bot?: boolean
  reakcje?: { ikona: SpriteName; ile: number }[]
  /** Załącznik obrazkowy. */
  obraz?: string
}

/**
 * Godzina wiadomości ze znacznika ISO.
 *
 * Strefa jest podana JAWNIE, więc serwer (Vercel chodzi na UTC) i przeglądarka wyliczą
 * dokładnie ten sam tekst. Bez tego pierwsza wiadomość miałaby w HTML-u z serwera inną
 * godzinę niż po hydratacji i React zgłosiłby błąd.
 */
export function godzina(iso: string | Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Warsaw',
  }).format(new Date(iso))
}

/** Ile wiadomości wczytujemy na wejściu do kanału. */
export const LIMIT_WIADOMOSCI = 60

/** Najdłuższa wiadomość — tyle samo, ile przyjmuje pole w UI. */
export const MAX_DLUGOSC = 280

// ── Ogłoszenia: kanał bota, nie rozmowa ──────────────────────────────────────

export const OGLOSZENIA: Wiad[] = [
  {
    id: 'g1',
    autor: 'Dogma',
    czas: '09:00',
    bot: true,
    tekst: ['Czat piwnicy działa. Wiadomości zostają na zawsze. Uważaj, co piszesz.'],
  },
  {
    id: 'g2',
    autor: 'Dogma',
    czas: '11:20',
    bot: true,
    tekst: ['Nowe achievementy w Encyklopedii. Nadal ich nie masz.'],
  },
  {
    id: 'g3',
    autor: 'Dogma',
    czas: '12:45',
    bot: true,
    tekst: ['Przypomnienie: secret room istnieje. Nie znajdziesz go tutaj.'],
  },
]

/** Reakcje pod wiadomością — pickupy zamiast emoji. */
export const REAKCJE: SpriteName[] = ['heart', 'coin', 'skull', 'trophy']

// ── Kto jest w piwnicy: status + jego ikona ───────────────────────────────────

const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

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
