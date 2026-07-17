import type { FeedWpis } from '@/lib/social'
import type { SpriteName } from '@/components/Sprite'

/**
 * Klimat społeczności: etykiety typów wpisów i teksty „z Isaaca".
 *
 * Był tu też generator statystyk graczy (procent, godziny, ulubiony item) i ozdób pfp —
 * wyliczany z hasza nicku. Wyglądał wiarygodnie i właśnie dlatego był szkodliwy: pokazywał
 * liczby, za którymi nic nie stało. Dane graczy biorą się teraz wyłącznie z bazy i Steama.
 *
 * Losowanie tekstów jest DETERMINISTYCZNE (hash z id wpisu), a nie Math.random() — inaczej
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
  /** Feed ZNAJOMYCH — pusty, bo nie masz jeszcze kogo obserwować. */
  brakZnajomych: (
    <>
      <b>Sam jak Isaac w piwnicy.</b> Zaobserwuj kogoś — gdy odwzajemni, jego odblokowania i ubici
      bossowie zaczną tu spadać same.
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
  /**
   * Feed GLOBALNY pusty. To pierwsza rzecz, jaką widzi świeże konto, więc nie może być
   * samym „cisza" — musi powiedzieć, SKĄD w ogóle biorą się wpisy (z odblokowań Steama).
   */
  brakAktywnosci: (
    <>
      <b>Piwnica jeszcze nie krwawi.</b> Feed sam zapisuje każde Twoje odblokowanie ze Steama — z
      prawdziwą datą i ikoną. Zsynchronizuj i zobacz swoją historię.
    </>
  ),
  /**
   * Feed globalny pusty, ale patrzy GOŚĆ. Nie może zsynchronizować, więc nie każemy mu
   * tego robić — tekst musi pasować do przycisku, który stoi pod nim („Załóż konto").
   */
  brakAktywnosciGosc: (
    <>
      <b>Piwnica jeszcze nie krwawi.</b> Feed zapisuje odblokowania graczy prosto ze Steama — z
      prawdziwą datą i ikoną. Załóż konto, a Twoja historia wpadnie tu pierwsza.
    </>
  ),
  /** Aktywność na WŁASNYM profilu — nie masz wpisów, bo nie było syncu. */
  brakWpisow: (
    <>
      <b>Twoja karta jest jeszcze pusta.</b> Po synchronizacji wyląduje tu każde odblokowanie, które
      kiedykolwiek zdobyłeś w grze.
    </>
  ),
}
