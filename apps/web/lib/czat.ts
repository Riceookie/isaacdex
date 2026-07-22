import type { SpriteName } from '@/components/Sprite'
import type { Klucz, Tlumacz } from '@/lib/i18n/slownik'

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
  /** Klucz nazwy w słowniku — slug zostaje po polsku, nazwa na ekranie idzie za językiem. */
  kluczNazwy: Klucz
  ikona: SpriteName
  /** Klucz zdania pod nazwą — klimat, nie instrukcja obsługi. */
  kluczOpisu: Klucz
  typ: TypKanalu
}

export const KANALY: Kanal[] = [
  {
    slug: 'piwnica',
    kluczNazwy: 'czat.kanalPiwnicaNazwa',
    ikona: 'fly',
    kluczOpisu: 'czat.kanalPiwnicaOpis',
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
  /**
   * Reakcje z bazy: ikona, ile osób i czy jestem wśród nich.
   *
   * `ikona` to STRING, nie `SpriteName` — reakcją może być zarówno ikona interfejsu
   * („heart"), jak i dowolna naklejka z katalogu („c105"). Rozplątuje to `IkonaCzatu`.
   */
  reakcje?: { ikona: string; ile: number; moja: boolean }[]
  /** Załącznik obrazkowy. */
  obraz?: string
  /** Autor edytował ją po wysłaniu → dyskretne „(edytowano)". */
  edytowana?: boolean
  /**
   * Cytat wiadomości, na którą to jest odpowiedź (jak na Discordzie). `null` = zwykła wiadomość.
   * `usunieta` = oryginał skasowano (odpowiedź została, cytat pokazujemy jako „usunięta").
   */
  odpowiedz?: { autor: string; tekst: string; usunieta?: boolean } | null
  /** Nagrobek: wiadomość skasowano „dla wszystkich" — treści już nie ma, pokazujemy kto usunął. */
  usunieta?: boolean
  /** Nick osoby, która skasowała (dla pozostałych: „X usunął wiadomość"). */
  usunietaPrzez?: string
  /** Czy to JA skasowałem — wtedy „Ty usunąłeś wiadomość" zamiast nicku. */
  usunietaPrzezMnie?: boolean
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

/**
 * Domyślna czwórka pod przyciskiem „+" — zanim ktokolwiek kliknie cokolwiek własnego.
 * Reagować można dowolnym itemem z katalogu naklejek („Więcej…"); to tylko skrót na start.
 */
export const REAKCJE: string[] = ['heart', 'coin', 'skull', 'trophy']

// ── Kwestie dla familiara z górnego paska (jednego, tego z TopBara) ───────────

const PO_WYSLANIU: Klucz[] = [
  'czat.poWyslaniu1',
  'czat.poWyslaniu2',
  'czat.poWyslaniu3',
  'czat.poWyslaniu4',
  'czat.poWyslaniu5',
]

const W_KANALE: Record<string, Klucz> = {
  piwnica: 'czat.wKanalePiwnica',
}

/**
 * Co familiar ma powiedzieć na zdarzenie w czacie. Sam tekst — wysyłką zajmuje się
 * `powiedz()` z lib/companionGlos, a wypisuje go maskotka w TopBarze.
 *
 * Tłumacz wchodzi parametrem, bo funkcja jest wołana z komponentu klienckiego — tam
 * język siedzi w kontekście (`useT`), a nie w ciasteczku czytanym z serwera.
 */
export function kwestiaCzatu(
  t: Tlumacz,
  typ: 'wyslano' | 'kanal',
  co: string,
  licznik: number,
): string {
  if (typ === 'wyslano') return t(PO_WYSLANIU[licznik % PO_WYSLANIU.length])
  const nick = nickZDm(co)
  if (nick) return t('czat.wDm', { nick })
  return t(W_KANALE[co] ?? 'czat.wKanaleInny')
}
