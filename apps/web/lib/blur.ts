import { useEffect, useState } from 'react'

/**
 * „Curse of the Blind" dla czatu — zasłanianie przekleństw znakami zapytania.
 *
 * To nie jest twarda moderacja (której się nie da zrobić listą słów), tylko kurtuazyjny filtr
 * jak klątwa z gry: brzydkie słowo zamienia się w „???", więc nikt nie dostaje ścianą wulgaryzmów
 * w twarz. Domyślnie WŁĄCZONY; kto woli surową piwnicę, wyłącza go w Ustawieniach.
 *
 * Dopasowujemy RDZENIE z dowolną końcówką (polski odmienia przekleństwa na sto sposobów), więc
 * `jeb\w*` łapie „jebać", „jebany", „zajebiste". Świadomie pomijamy krótkie słowa łatwe o
 * fałszywy alarm (np. samo „ass" w „class"), żeby filtr nie kaleczył zwykłych zdań.
 */
const RDZENIE = [
  // PL
  'kurw',
  'chuj',
  'huj',
  'jeb',
  'pierdol',
  'spierdal',
  'wypierdal',
  'rozpierdol',
  'pizd',
  'pierdziel',
  'kutas',
  'cipa',
  'cipe',
  'cipy',
  'gówn',
  'gown',
  'skurwiel',
  'skurwysyn',
  'dziwka',
  'dziwke',
  'suka',
  'debil',
  'kretyn',
  // EN
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'dick',
  'cunt',
  'bastard',
  'whore',
  'slut',
  'nigg',
  'fagg',
  'retard',
  'piss',
  'motherfuck',
]

// Jeden regex z rdzeni; granica z przodu, dowolna końcówka z tyłu. `u` — polskie znaki, `i` — bez
// względu na wielkość liter. Budowany raz (koszt kompilacji regexu nie idzie na każdą wiadomość).
const WZORZEC = new RegExp(`\\b(?:${RDZENIE.join('|')})\\p{L}*`, 'giu')

/** Zamienia przekleństwa na „???". Pusty/zwykły tekst wraca bez zmian. */
export function blurujTekst(tekst: string): string {
  if (!tekst) return tekst
  return tekst.replace(WZORZEC, '???')
}

// ── Ustawienie (localStorage) — czy blur jest włączony ──────────────────────────────

const KLUCZ = 'idx_blur'
const ZDARZENIE = 'idx-blur'

/** Czy zasłanianie jest włączone. DOMYŚLNIE tak — dopiero jawne „off" je wyłącza. */
export function czytajBlur(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(KLUCZ) !== 'off'
}

/** Zapis wyboru + rozgłoszenie, żeby otwarty czat zareagował natychmiast (bez odświeżania). */
export function ustawBlur(on: boolean) {
  localStorage.setItem(KLUCZ, on ? 'on' : 'off')
  window.dispatchEvent(new CustomEvent(ZDARZENIE))
}

/**
 * Stan blura dla komponentów. Startuje z `true` (spójnie z renderem serwera, który localStorage
 * nie zna — a że domyślnie zasłaniamy, pierwszy paint jest „bezpieczny"). Po montażu czyta wybór
 * i słucha zmian: własnych (CustomEvent z tej karty) i z innych kart (`storage`).
 */
export function useBlur(): boolean {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const odswiez = () => setOn(czytajBlur())
    odswiez()
    window.addEventListener(ZDARZENIE, odswiez)
    window.addEventListener('storage', odswiez)
    return () => {
      window.removeEventListener(ZDARZENIE, odswiez)
      window.removeEventListener('storage', odswiez)
    }
  }, [])
  return on
}
