import type { SpriteName } from '@/components/Sprite'

/**
 * Czat piwnicy: kanał globalny plus prywatne rozmowy ze znajomymi.
 *
 * Wszystkie wiadomości są PRAWDZIWE — leżą w tabeli `Wiadomosc`, przeżywają odświeżenie
 * i dolatują do wszystkich w kanale przez Supabase Realtime (patrz components/CzatWidok.tsx).
 *
 * Był tu jeszcze kanał „ogłoszenia" z botem Dogmą: trzy zdania wpisane w kod, udające
 * komunikaty systemu. Nikt ich nie pisał i nic za nimi nie stało, więc kanał zniknął —
 * wróci, gdy będzie miał co ogłaszać i skąd to brać.
 */

export type TypKanalu = 'global' | 'dm'

export type Kanal = {
  slug: string
  nazwa: string
  ikona: SpriteName
  /** Zdanie pod nazwą — klimat, nie instrukcja obsługi. */
  opis: string
  typ: TypKanalu
}

export const KANALY: Kanal[] = [
  {
    slug: 'piwnica',
    nazwa: 'piwnica',
    ikona: 'fly',
    opis: 'Czat globalny. Krew, łzy i skill issue.',
    typ: 'global',
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
  /** Reakcje z bazy: ikona, ile osób i czy jestem wśród nich. */
  reakcje?: { ikona: SpriteName; ile: number; moja: boolean }[]
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

/** Reakcje pod wiadomością — pickupy zamiast emoji. */
export const REAKCJE: SpriteName[] = ['heart', 'coin', 'skull', 'trophy']

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
