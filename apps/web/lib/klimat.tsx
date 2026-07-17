import type { FeedWpis } from '@/lib/social'
import type { SpriteName } from '@/components/Sprite'
import type { DecorId } from '@/lib/pfpDecor'

/**
 * Klimat społeczności: etykiety typów wpisów, teksty „z Isaaca" i placeholderowe
 * statystyki graczy demo (do kart w „Odkryj graczy").
 *
 * Losowanie jest DETERMINISTYCZNE (hash z id/nicku), a nie Math.random() — inaczej
 * serwer i klient wylosowałyby inny tekst i React zgłosiłby błąd hydratacji.
 */

export const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// Uwaga: w .tsx `<T>(…) =>` parsuje się jak JSX, więc generyk musi być zwykłą funkcją.
export function zListy<T>(lista: T[], ziarno: string): T {
  return lista[hash(ziarno) % lista.length]
}

// ── Typy wpisów: co się stało + jaka ikona i kolor ──────────────────────────────

export type TypWpisu = FeedWpis['typ']

/**
 * Formy BEZOSOBOWE („odblokowano"), a nie „odblokował(a)". Płci gracza nie znamy i nigdy
 * o nią nie pytamy, a nawias z końcówką czyta się jak formularz urzędowy, nie jak feed.
 */
export const ETYKIETA: Record<TypWpisu, { czasownik: string; ikona: SpriteName }> = {
  UNLOCK: { czasownik: '— odblokowano achievement', ikona: 'trophy' },
  BOSS: { czasownik: '— pokonano bossa', ikona: 'deadgod' },
  RUN: { czasownik: '— zakończono run', ikona: 'stats' },
  TEKST: { czasownik: '— wpis', ikona: 'book' },
}

// ── Flavor text: krótki komentarz pod wpisem, jak opisy itemów w grze ───────────

const KOMENTARZE: Record<TypWpisu, string[]> = {
  UNLOCK: [
    'Kolejna ikonka w kolekcji.',
    'Papa Isaac byłby dumny.',
    'Odblokowane. Bezpowrotnie.',
    'Save file grubszy o jedną pozycję.',
  ],
  BOSS: [
    'Boss padł. Piwnica pamięta.',
    'Jedna łza mniej do wylania.',
    'Nikt nie liczył, ile prób to kosztowało.',
    'Kolejny znaczek na ścianie.',
  ],
  RUN: [
    'Run zamknięty. Itemy zabrane do grobu.',
    'Zdrowie: nieistotne. Damage: tak.',
    'Ten build nie powinien działać. Zadziałał.',
    'RNG dziś było łaskawe.',
  ],
  TEKST: [
    'Piwnica słucha.',
    'Ktoś musiał to powiedzieć.',
    'Dyskusja otwarta.',
    'Wpis prosto z Basementu.',
  ],
}

/** Komentarz do wpisu — ten sam wpis zawsze dostaje ten sam tekst. */
export function komentarz(w: Pick<FeedWpis, 'id' | 'typ'>): string {
  return zListy(KOMENTARZE[w.typ], `${w.typ}-${w.id}`)
}

// ── Nagłówki pustych stanów ────────────────────────────────────────────────────

export const PUSTKA = {
  /** Do FEEDU — tłumaczy, czemu nie ma wpisów. */
  brakZnajomych: (
    <>
      <b>Sam jak Isaac w piwnicy.</b> Znajdź graczy i zaobserwuj ich — gdy odwzajemnią, ich
      aktywność wyląduje tutaj.
    </>
  ),
  /**
   * Do LISTY znajomych. Osobny tekst, bo na Znajomych lista i feed stoją obok siebie —
   * ten sam komunikat dwa razy na jednym ekranie wyglądał jak usterka, a nie jak pustka.
   */
  brakZnajomychLista: (
    <>
      <b>Nikt jeszcze nie odwzajemnił.</b> Znajomy = obserwujecie się nawzajem.
    </>
  ),
  brakWynikow: (
    <>
      <b>Nikogo takiego tu nie ma.</b> Nikt o tym nicku nie schodził do piwnicy. Spróbuj inaczej.
    </>
  ),
  brakAktywnosci: (
    <>
      <b>Cisza jak w Sklepie o 3 w nocy…</b> Nikt teraz nic nie ubija.
    </>
  ),
}

// ── Placeholder: statystyki graczy demo (docelowo ze Steama, jak Twoje) ─────────

export type StatyGracza = {
  procent: number
  deadGod: boolean
  godziny: number
  ulubiony: string
}

/** Ręcznie dobrane dla znanych nicków; reszta dostaje wartości z hasha (stabilne). */
const STATY: Record<string, StatyGracza> = {
  VoidKing: { procent: 100, deadGod: true, godziny: 1840, ulubiony: 'Void' },
  Lilith: { procent: 98, deadGod: true, godziny: 1210, ulubiony: 'Incubus' },
  Chomik: { procent: 100, deadGod: true, godziny: 940, ulubiony: 'Sacred Heart' },
  Jorge: { procent: 76, deadGod: false, godziny: 520, ulubiony: 'Bloody Lust' },
  Mama: { procent: 88, deadGod: false, godziny: 660, ulubiony: "Mom's Knife" },
  Kostka: { procent: 71, deadGod: false, godziny: 430, ulubiony: 'The D6' },
  Sadza: { procent: 94, deadGod: true, godziny: 1520, ulubiony: 'Holy Mantle' },
  Brimstone: { procent: 83, deadGod: false, godziny: 780, ulubiony: 'Brimstone' },
  Grzesiek: { procent: 69, deadGod: false, godziny: 350, ulubiony: 'Chocolate Milk' },
  Klucznik: { procent: 62, deadGod: false, godziny: 290, ulubiony: 'Store Key' },
  Zapomniana: { procent: 91, deadGod: true, godziny: 1080, ulubiony: 'Sacred Heart' },
  Bracia: { procent: 74, deadGod: false, godziny: 470, ulubiony: 'Birthright' },
  Wisp: { procent: 80, deadGod: false, godziny: 610, ulubiony: 'Book of Virtues' },
  Skazany: { procent: 96, deadGod: true, godziny: 1330, ulubiony: 'Dark Arts' },
}

const ITEMY = ['Brimstone', 'Godhead', 'The D6', 'Polyphemus', 'Sacred Heart', 'Tech X']

/**
 * Dekoracja pfp gracza demo — losowana z nicku, więc każdy ma swoją i zawsze tę samą.
 * Dostają ją tylko gracze z własnym avatarem (ci „urządzeni"); reszta chodzi bez ozdób,
 * żeby listy nie zamieniły się w choinkę.
 *
 * Dekoracja właściciela apki siedzi w localStorage (patrz ProfileAvatar) — graczy demo
 * nie mamy gdzie trzymać w bazie, więc do czasu logowania wystarczy to losowanie.
 */
const DEKORACJE: DecorId[] = ['death', 'deadgod', 'siren', 'brownie', 'steven', 'heart', 'fly']

export function dekoracjaGracza(nick: string, maWlasnyAvatar: boolean): DecorId {
  if (!maWlasnyAvatar) return 'none'
  return zListy(DEKORACJE, 'decor-' + nick)
}

export function statyGracza(nick: string): StatyGracza {
  const znane = STATY[nick]
  if (znane) return znane
  const h = hash(nick)
  const procent = 40 + (h % 55)
  return {
    procent,
    deadGod: procent >= 97,
    godziny: 120 + (h % 900),
    ulubiony: zListy(ITEMY, nick),
  }
}
