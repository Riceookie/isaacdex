import type { Przestrzen } from '../typy'

/**
 * Sidebar, górny pasek i drobne przełączniki.
 *
 * Etykiety samych pozycji menu NIE stoją tutaj — siedzą w `wspolne` (`navPulpit`, `navProfil`…),
 * bo te same nazwy sekcji pojawiają się też poza nawigacją (odnośniki w tekstach, puste stany).
 */
export const nawigacja = {
  otworzMenu: { en: 'Open menu', pl: 'Otwórz menu' },
  zamknijMenu: { en: 'Close menu', pl: 'Zamknij menu' },
  wyloguj: { en: 'Sign out', pl: 'Wyloguj' },

  // Kursor-mucha — familiar, który lata za wskaźnikiem myszy.
  wlaczMuche: { en: 'Let the fly out', pl: 'Włącz muchę' },
  wylaczMuche: { en: 'Swat the fly', pl: 'Wyłącz muchę' },
  muchaWl: { en: 'Fly: on', pl: 'Mucha: wł.' },
  muchaWyl: { en: 'Fly: off', pl: 'Mucha: wył.' },
} satisfies Przestrzen
