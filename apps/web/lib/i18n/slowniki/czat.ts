import type { Przestrzen } from '../typy'

/** Czat piwnicy: kanały, wiadomości, reakcje, naklejki. */
export const czat = {
  // ── Kanały (dane z lib/czat.ts) ──
  kanalPiwnicaNazwa: { en: 'basement', pl: 'piwnica' },
  kanalPiwnicaOpis: {
    en: 'Global chat. Blood, tears and skill issues.',
    pl: 'Czat globalny. Krew, łzy i skill issue.',
  },
  dmOpis: {
    en: 'Private conversation. Nobody else sees this.',
    pl: 'Rozmowa prywatna. Nikt inny tego nie widzi.',
  },

  // ── Kwestie familiara (lib/czat.ts) ──
  poWyslaniu1: { en: 'The basement is listening.', pl: 'Piwnica słucha.' },
  poWyslaniu2: {
    en: 'Nicely put. Nobody will answer.',
    pl: 'Ładnie powiedziane. Nikt nie odpowie.',
  },
  poWyslaniu3: { en: 'Saved. Forever.', pl: 'Zapisane. Na zawsze.' },
  poWyslaniu4: { en: 'Brave. We shall see.', pl: 'Odważne. Zobaczymy.' },
  poWyslaniu5: { en: 'Someone will read that. One day.', pl: 'Ktoś to przeczyta. Kiedyś.' },
  wKanalePiwnica: { en: 'The whole basement can hear you.', pl: 'Cała piwnica cię słyszy.' },
  wKanaleInny: { en: 'Onwards.', pl: 'Idziemy dalej.' },
  wDm: {
    en: 'Writing to {nick}. Just the two of you.',
    pl: 'Piszesz do {nick}. Tylko wy dwoje.',
  },

  // ── Błędy z serwera (app/actions/czat.ts) ──
  bladZalogujByPisac: { en: 'Sign in to write.', pl: 'Zaloguj się, aby pisać.' },
  bladPustaWiadomosc: { en: 'Empty message.', pl: 'Pusta wiadomość.' },
  bladBrakKanalu: { en: 'No such channel.', pl: 'Nie ma takiego kanału.' },
  bladZalogujByReagowac: { en: 'Sign in to react.', pl: 'Zaloguj się, aby reagować.' },
  bladNieznanaReakcja: { en: 'Unknown reaction.', pl: 'Nieznana reakcja.' },
  bladBrakWiadomosci: { en: 'No such message.', pl: 'Nie ma takiej wiadomości.' },
  bladNieTwojKanal: { en: 'Not your channel.', pl: 'Nie Twój kanał.' },

  // ── Błędy załączników (components/CzatWidok.tsx) ──
  bladWysylkiObrazka: {
    en: 'The image would not go through. Try again.',
    pl: 'Nie udało się wysłać obrazka. Spróbuj jeszcze raz.',
  },
  bladObrazekZaDuzy: {
    en: 'That image is too big (3 MB max).',
    pl: 'Obrazek jest za duży (maks. 3 MB).',
  },

  // ── Lista kanałów ──
  piwnicaNaglowek: { en: 'Basement', pl: 'Piwnica' },
  grupaPrywatne: { en: 'Private', pl: 'Prywatne' },
  goscZalogujSie: { en: 'Sign in', pl: 'Zaloguj się' },
  goscZalogujReszta: {
    en: ' to message friends privately.',
    pl: ', aby pisać prywatnie ze znajomymi.',
  },
  brakZnajomych: {
    en: 'No friends yet. Nobody to whisper to.',
    pl: 'Brak znajomych. Prywatnie nie ma z kim pogadać.',
  },
  online: { en: 'online', pl: 'online' },
  /** Licznik nieobecnych — w klimacie apki nie „offline", tylko martwi. */
  zgineli: {
    en: { one: 'dead — offline', other: 'dead — offline' },
    pl: {
      one: 'zginął — offline',
      few: 'zginęło — offline',
      many: 'zginęło — offline',
      other: 'zginęło — offline',
    },
  },

  // ── Nagłówek kanału ──
  wrocDoKanalow: { en: 'Back to the channel list', pl: 'Wróć do listy kanałów' },
  schowajObecnych: { en: 'Hide the list of who is here', pl: 'Schowaj listę obecnych' },
  pokazObecnych: { en: 'Show who is in the basement', pl: 'Pokaż, kto jest w piwnicy' },
  schowajListe: { en: 'Hide the list', pl: 'Schowaj listę' },
  wPiwnicyIle: { en: 'In the basement: {liczba}', pl: 'W piwnicy: {liczba}' },

  // ── Wiadomości ──
  wczytuje: { en: 'Loading…', pl: 'Wczytuję…' },
  ciszaDm: {
    en: 'Silence. Message {nick} first — nobody else will see it.',
    pl: 'Cisza. Napisz do {nick} pierwszy — zobaczy to tylko on.',
  },
  piwnicaMilczyGosc: {
    en: 'The basement is still quiet. Make an account and go first.',
    pl: 'Piwnica jeszcze milczy. Załóż konto i bądź pierwszy.',
  },
  piwnicaMilczy: {
    en: 'The basement is still quiet. The first message stays in the log forever.',
    pl: 'Piwnica jeszcze milczy. Pierwsza wiadomość zostaje w historii na zawsze.',
  },
  ty: { en: 'You', pl: 'Ty' },
  wiadomoscUsunieta: { en: 'Message deleted', pl: 'Wiadomość usunięta' },
  // Nagrobek po skasowaniu: „Ty" temu, kto skasował; nick pozostałym. PL neutralnie płciowo.
  usunietaPrzezCiebie: {
    en: 'You deleted a message',
    pl: 'Wiadomość usunięta przez Ciebie',
  },
  usunietaPrzezKogos: {
    en: '{nick} deleted a message',
    pl: 'Wiadomość usunięta przez {nick}',
  },
  zalacznikAlt: { en: 'Attachment', pl: 'Załącznik' },
  dodajReakcje: { en: 'Add a reaction', pl: 'Dodaj reakcję' },
  usunWiadomosc: { en: 'Delete message', pl: 'Usuń wiadomość' },
  odpowiedz: { en: 'Reply', pl: 'Odpowiedz' },
  edytujWiadomosc: { en: 'Edit message', pl: 'Edytuj wiadomość' },
  zapiszEdycje: { en: 'Save edit', pl: 'Zapisz zmianę' },
  edytowano: { en: '(edited)', pl: '(edytowano)' },
  odpowiadaszNa: { en: 'Replying to {nick}', pl: 'Odpowiadasz {nick}' },
  anulujOdpowiedz: { en: 'Cancel reply', pl: 'Anuluj odpowiedź' },
  rozciagnij: {
    en: 'Drag to resize the chat (double-click to reset)',
    pl: 'Pociągnij, aby zmienić wysokość czatu (dwuklik = reset)',
  },
  // Potwierdzenie skasowania (dla wszystkich).
  usunPytanie: {
    en: 'Delete this message for everyone?',
    pl: 'Usunąć tę wiadomość dla wszystkich?',
  },
  usunTak: { en: 'Delete', pl: 'Usuń' },
  usunNie: { en: 'Keep', pl: 'Zostaw' },
  // Błąd z akcji edycji/kasowania cudzej wiadomości.
  bladNieTwoja: { en: 'That is not your message.', pl: 'To nie Twoja wiadomość.' },

  // ── „X pisze…" ──
  lacznikI: { en: 'and', pl: 'i' },
  pisze: {
    en: { one: '{kto} is typing…', other: '{kto} are typing…' },
    pl: { one: '{kto} pisze…', few: '{kto} piszą…', many: '{kto} piszą…', other: '{kto} piszą…' },
  },

  // ── Pole pisania ──
  goscCzytasz: {
    en: 'You are reading the basement as a guest.',
    pl: 'Czytasz piwnicę jako gość.',
  },
  goscZalozKonto: { en: 'Make an account', pl: 'Załóż konto' },
  goscZalozKontoReszta: {
    en: ' to write, drop screenshots and react with pickups.',
    pl: ', żeby pisać, wrzucać screeny i reagować pickupami.',
  },
  podgladZalacznika: { en: 'Attachment preview', pl: 'Podgląd załącznika' },
  usunZalacznik: { en: 'Remove attachment', pl: 'Usuń załącznik' },
  dodajObrazek: { en: 'Add an image', pl: 'Dodaj obrazek' },
  dodajObrazekTytul: {
    en: 'Add an image (you can paste from the clipboard too)',
    pl: 'Dodaj obrazek (możesz też wkleić ze schowka)',
  },
  naklejkiPrzycisk: { en: 'Stickers', pl: 'Naklejki' },
  naklejkaTytul: { en: 'Sticker', pl: 'Naklejka' },
  napiszDoNicku: { en: 'Message {nick}…', pl: 'Napisz do {nick}…' },
  napiszDoKanalu: { en: 'Message #{kanal}…', pl: 'Napisz do #{kanal}…' },
  trescWiadomosci: { en: 'Message text', pl: 'Treść wiadomości' },
  wyslij: { en: 'Send', pl: 'Wyślij' },

  // ── Lista „W piwnicy" ──
  wPiwnicyNaglowek: { en: 'In the basement — {liczba}', pl: 'W piwnicy — {liczba}' },
  toTy: { en: 'that is you', pl: 'to Ty' },
  statusWPiwnicy: { en: 'in the basement', pl: 'w piwnicy' },

  // ── Katalog naklejek / reakcji ──
  szukajPlaceholder: { en: 'Search…', pl: 'Szukaj…' },
  nicTakiego: { en: 'Nothing like that.', pl: 'Nic takiego.' },
  katItemy: { en: 'Items', pl: 'Itemy' },
  katTrinkety: { en: 'Trinkets', pl: 'Trinkety' },
  katPickupy: { en: 'Pickups', pl: 'Pickupy' },
  etykietaNaklejki: { en: 'Sticker {nazwa}', pl: 'Naklejka {nazwa}' },
  etykietaReakcji: { en: 'Reaction {nazwa}', pl: 'Reakcja {nazwa}' },
  wiecej: { en: 'More…', pl: 'Więcej…' },
  wrocDoOstatnich: { en: '← Recent', pl: '← Ostatnie' },
} satisfies Przestrzen
