import type { ReactElement } from 'react'
import type { FeedWpis } from '@/lib/social'
import type { SpriteName } from '@/components/Sprite'
import type { Klucz } from '@/lib/i18n/slownik'
import TekstKlimat from '@/components/TekstKlimat'

/**
 * Klimat społeczności: etykiety typów wpisów i teksty „z Isaaca".
 *
 * Był tu też generator statystyk graczy (procent, godziny, ulubiony item) i ozdób pfp —
 * wyliczany z hasza nicku. Wyglądał wiarygodnie i właśnie dlatego był szkodliwy: pokazywał
 * liczby, za którymi nic nie stało. Dane graczy biorą się teraz wyłącznie z bazy i Steama.
 *
 * Losowanie tekstów jest DETERMINISTYCZNE (hash z id wpisu), a nie Math.random() — inaczej
 * serwer i klient wylosowałyby inny tekst i React zgłosiłby błąd hydratacji.
 *
 * I18N: to moduł z DANYMI — nie ma tu ani hooka, ani `cookies()`, więc same napisy siedzą
 * w słowniku (`lib/i18n/slowniki/klimat.ts`), a stąd wychodzą już jako gotowe elementy
 * <TekstKlimat …/>, które tłumaczą się przy renderze. Dzięki temu miejsca użycia (`PUSTKA`
 * na stronach serwerowych, `komentarz` i `ETYKIETA` w klienckim FeedCard) zostają bez zmian.
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
export const ETYKIETA: Record<TypWpisu, { czasownik: ReactElement; ikona: SpriteName }> = {
  UNLOCK: { czasownik: <TekstKlimat k="klimat.etykietaUnlock" />, ikona: 'trophy' },
  BOSS: { czasownik: <TekstKlimat k="klimat.etykietaBoss" />, ikona: 'deadgod' },
  RUN: { czasownik: <TekstKlimat k="klimat.etykietaRun" />, ikona: 'stats' },
  TEKST: { czasownik: <TekstKlimat k="klimat.etykietaTekst" />, ikona: 'book' },
}

// ── Flavor text: krótki komentarz pod wpisem, jak opisy itemów w grze ───────────

// Losujemy KLUCZE, a nie gotowe zdania: dzięki temu ten sam wpis dostaje ten sam komentarz
// niezależnie od języka (hash liczy się z id wpisu, nie z treści) — przełączenie języka
// zmienia tekst, ale nie „przetasowuje" feedu.
const KOMENTARZE: Record<TypWpisu, Klucz[]> = {
  UNLOCK: [
    'klimat.komentarzUnlock1',
    'klimat.komentarzUnlock2',
    'klimat.komentarzUnlock3',
    'klimat.komentarzUnlock4',
  ],
  BOSS: [
    'klimat.komentarzBoss1',
    'klimat.komentarzBoss2',
    'klimat.komentarzBoss3',
    'klimat.komentarzBoss4',
  ],
  RUN: [
    'klimat.komentarzRun1',
    'klimat.komentarzRun2',
    'klimat.komentarzRun3',
    'klimat.komentarzRun4',
  ],
  TEKST: [
    'klimat.komentarzTekst1',
    'klimat.komentarzTekst2',
    'klimat.komentarzTekst3',
    'klimat.komentarzTekst4',
  ],
}

/** Komentarz do wpisu — ten sam wpis zawsze dostaje ten sam tekst. */
export function komentarz(w: Pick<FeedWpis, 'id' | 'typ'>): ReactElement {
  return <TekstKlimat k={zListy(KOMENTARZE[w.typ], `${w.typ}-${w.id}`)} />
}

// ── Nagłówki pustych stanów ────────────────────────────────────────────────────

export const PUSTKA = {
  /** Feed ZNAJOMYCH — pusty, bo nie masz jeszcze kogo obserwować. */
  brakZnajomych: <TekstKlimat k="klimat.brakZnajomych" />,
  /**
   * Do LISTY znajomych. Osobny tekst, bo na Znajomych lista i feed stoją obok siebie —
   * ten sam komunikat dwa razy na jednym ekranie wyglądał jak usterka, a nie jak pustka.
   */
  brakZnajomychLista: <TekstKlimat k="klimat.brakZnajomychLista" />,
  brakWynikow: <TekstKlimat k="klimat.brakWynikow" />,
  /**
   * Feed GLOBALNY pusty. To pierwsza rzecz, jaką widzi świeże konto, więc nie może być
   * samym „cisza" — musi powiedzieć, SKĄD w ogóle biorą się wpisy (z odblokowań Steama).
   */
  brakAktywnosci: <TekstKlimat k="klimat.brakAktywnosci" />,
  /**
   * Feed globalny pusty, ale patrzy GOŚĆ. Nie może zsynchronizować, więc nie każemy mu
   * tego robić — tekst musi pasować do przycisku, który stoi pod nim („Załóż konto").
   */
  brakAktywnosciGosc: <TekstKlimat k="klimat.brakAktywnosciGosc" />,
  /** Aktywność na WŁASNYM profilu — nie masz wpisów, bo nie było syncu. */
  brakWpisow: <TekstKlimat k="klimat.brakWpisow" />,
}
