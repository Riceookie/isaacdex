import type { Przestrzen } from '../typy'

/** Teksty używane w wielu miejscach — nawigacja, przyciski, stany puste. */
export const wspolne = {
  zaloguj: { en: 'Sign in', pl: 'Zaloguj się' },
  zamknij: { en: 'Close', pl: 'Zamknij' },
  szukaj: { en: 'Search…', pl: 'Szukaj…' },
  anuluj: { en: 'Cancel', pl: 'Anuluj' },
  zapisz: { en: 'Save', pl: 'Zapisz' },
  wroc: { en: 'Back', pl: 'Wróć' },
  wkrotce: { en: 'Soon', pl: 'Wkrótce' },
  nicTakiego: { en: 'Nothing like that.', pl: 'Nic takiego.' },

  navPulpit: { en: 'Home', pl: 'Pulpit' },
  navProfil: { en: 'Profile', pl: 'Profil' },
  navOsiagniecia: { en: 'Achievements', pl: 'Osiągnięcia' },
  navEncyklopedia: { en: 'Encyclopedia', pl: 'Encyklopedia' },
  navKalkulator: { en: 'Calculator', pl: 'Kalkulator' },
  navStatystyki: { en: 'Stats', pl: 'Statystyki' },
  navZnajomi: { en: 'Friends', pl: 'Znajomi' },
  navCzat: { en: 'Chat', pl: 'Czat' },
  navUstawienia: { en: 'Settings', pl: 'Ustawienia' },

  // Liczniki — polski ma trzy formy, angielski dwie.
  wpisy: {
    en: { one: '{liczba} post', other: '{liczba} posts' },
    pl: {
      one: '{liczba} wpis',
      few: '{liczba} wpisy',
      many: '{liczba} wpisów',
      other: '{liczba} wpisu',
    },
  },
  obserwujacych: {
    en: { one: '{liczba} follower', other: '{liczba} followers' },
    pl: {
      one: '{liczba} obserwujący',
      few: '{liczba} obserwujących',
      many: '{liczba} obserwujących',
      other: '{liczba} obserwujących',
    },
  },
} satisfies Przestrzen
