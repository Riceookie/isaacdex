import type { Przestrzen } from '../typy'

/**
 * Sekretny Pokój — ukryty ekran w klimacie „secret room" z gry (te za zbombardowaną ścianą).
 * Wejście jest zataczone (mały Keeper na górnym pasku, rysa na dole sidebara), a w środku
 * Keeper zadaje zagadkę. Poprawna odpowiedź nadaje tytuł „Keeper". Nazwy własne (Keeper,
 * Secret Room) zostają po angielsku — to żargon z gry — reszta jest tłumaczona.
 */
export const sekret = {
  tab: { en: '???', pl: '???' },
  naglowek: { en: 'Secret Room', pl: 'Sekretny Pokój' },

  // Wejście przez małego Keepera na pasku / rysę w sidebarze.
  wejscieTip: { en: 'There is a crack in the wall…', pl: 'W ścianie jest rysa…' },

  // Lore — szept w ciemności, zanim padnie zagadka.
  lore: {
    en: 'The wall gives way to a coin-lit room. A hunched figure counts what it will never spend, and does not look up.',
    pl: 'Ściana ustępuje, odsłaniając pokój w blasku monet. Zgarbiona postać liczy to, czego nigdy nie wyda, i nawet nie podnosi wzroku.',
  },

  zagadkaNaglowek: { en: 'It finally speaks:', pl: 'W końcu się odzywa:' },
  zagadka: {
    en: 'Coins are my heart, and coins are my health. I mind a shop I will never rob. Bomb the right wall and you will meet me. Whisper my name.',
    pl: 'Monety to moje serce i moje życie. Pilnuję sklepu, którego nigdy nie okradnę. Zbombarduj właściwą ścianę, a mnie spotkasz. Wyszepcz moje imię.',
  },
  polePlaceholder: { en: 'a name…', pl: 'imię…' },
  przycisk: { en: 'Whisper', pl: 'Wyszepcz' },

  zlaOdpowiedz: {
    en: 'The figure shakes its head and keeps counting. (It is its own currency — a shopkeeper made of coins.)',
    pl: 'Postać kręci głową i liczy dalej. (Jest własną walutą — sklepikarzem z monet.)',
  },

  // Po zdobyciu.
  sukcesNaglowek: { en: 'It looks up.', pl: 'Podnosi wzrok.' },
  sukcesOpis: {
    en: 'The Keeper meets your eyes, drops a single coin into your palm and nods. You were the kind who looks where nobody does.',
    pl: 'Keeper patrzy ci w oczy, wrzuca w dłoń jedną monetę i kiwa głową. Byłeś z tych, co szukają tam, gdzie nikt.',
  },
  nagroda: { en: 'New title unlocked', pl: 'Odblokowano tytuł' },
  nagrodaTytul: { en: 'Keeper', pl: 'Keeper' },
  nagrodaOpis: {
    en: 'It now sits with your other titles. Pick it under your nick in the profile editor.',
    pl: 'Dołączył do Twoich tytułów. Ustaw go pod nickiem w edytorze profilu.',
  },
  doEdytora: { en: 'Choose your title', pl: 'Wybierz swój tytuł' },

  // Ktoś już odkryty wraca do pokoju.
  powrotNaglowek: { en: 'The Keeper remembers you.', pl: 'Keeper cię pamięta.' },
  powrotOpis: {
    en: 'This room already gave up its secret to you. The coins keep counting themselves.',
    pl: 'Ten pokój już wydał ci swój sekret. Monety liczą się dalej same.',
  },

  // Gość — nie ma komu nadać tytułu.
  goscNaglowek: { en: 'You are barely here.', pl: 'Ledwie tu jesteś.' },
  goscOpis: {
    en: 'Secrets need someone to keep them. Sign in and the room will notice you.',
    pl: 'Sekrety potrzebują kogoś, kto je zachowa. Zaloguj się, a pokój cię zauważy.',
  },

  wroc: { en: 'Back out of the wall', pl: 'Wyjdź ze ściany' },
} satisfies Przestrzen
