import type { Przestrzen } from '../typy'

/**
 * Społeczność i pulpit: /znajomi, strona główna, feed, szukajka graczy i dzwonek.
 *
 * Dwie rzeczy warte uwagi dla kogoś, kto tu dopisuje teksty:
 *
 * 1. Zdania z linkami trzymamy jako gotowy HTML (`<a href>`), a nie jako trzy klucze
 *    sklejane w JSX — szyk zdania w polskim i angielskim jest różny i sklejanka
 *    rozjeżdża się przy pierwszym tłumaczeniu. Renderujemy je przez
 *    `dangerouslySetInnerHTML` (ten sam wzorzec co `ustawienia.kartkiOpis`).
 *
 * 2. Liczniki w panelu „Twoja sieć" mają liczbę w osobnym `<b>`, więc klucz niesie
 *    sam rzeczownik — ale i tak w formach mnogich, bo polski odmienia go po liczbie
 *    (1 znajomy / 2 znajomych / 5 znajomych).
 */
export const spolecznosc = {
  // ── /znajomi ──
  tytulStrony: { en: 'Friends — IsaacDex', pl: 'Znajomi — IsaacDex' },
  znajomi: { en: 'Friends', pl: 'Znajomi' },
  podtytul: {
    en: 'A friend is a follow both ways. Nobody walks into the basement alone.',
    pl: 'Znajomy = obserwujecie się nawzajem. Sam nikt do piwnicy nie schodzi.',
  },

  // Gość na /znajomi — cała zakładka to jedno zaproszenie do logowania.
  goscTekst: {
    en: '<b>Even Isaac started out alone.</b> Sign up to follow players, collect friends and watch the feed for whoever just caught a fresh trauma.',
    pl: '<b>Nawet Isaac zaczynał sam.</b> Załóż konto, żeby obserwować graczy, zbierać znajomych i widzieć w feedzie, kto właśnie oberwał traumą.',
  },
  goscPoza: {
    en: 'There is plenty to do without an account: <a href="/encyklopedia">Encyclopedia</a>, <a href="/kalkulator">Calculator</a> and the <a href="/czat">basement chat</a> (read-only).',
    pl: 'Bez konta też jest co robić: <a href="/encyklopedia">Encyklopedia</a>, <a href="/kalkulator">Kalkulator</a> i <a href="/czat">czat piwnicy</a> (do czytania).',
  },
  zalozKonto: { en: 'Sign up', pl: 'Załóż konto' },

  // Panel „Twoja sieć" — liczba stoi w <b> obok, tu jest sam rzeczownik.
  twojaSiec: { en: 'Your network', pl: 'Twoja sieć' },
  licznikZnajomi: {
    en: { one: 'friend', other: 'friends' },
    pl: { one: 'znajomy', few: 'znajomych', many: 'znajomych', other: 'znajomych' },
  },
  /** Czasownik, nie rzeczownik — nie odmienia się przez liczbę w żadnym z języków. */
  licznikObserwujesz: { en: 'following', pl: 'obserwujesz' },
  licznikObserwujacych: {
    en: { one: 'follower', other: 'followers' },
    pl: { one: 'obserwujący', few: 'obserwujących', many: 'obserwujących', other: 'obserwujących' },
  },
  licznikWpisy: {
    en: { one: 'post', other: 'posts' },
    pl: { one: 'wpis', few: 'wpisy', many: 'wpisów', other: 'wpisów' },
  },

  czekajaNaglowek: { en: 'Waiting for a follow back', pl: 'Czekają na odwzajemnienie' },
  czekajaOpis: {
    en: 'They follow you. One click and it turns into a friendship.',
    pl: 'Obserwują Cię. Jeden klik i robi się znajomość.',
  },

  listaObserwowani: { en: 'Following', pl: 'Obserwowani' },
  obserwowaniPodpis: {
    en: 'You follow them one way — no follow back yet.',
    pl: 'Obserwujesz jednostronnie — jeszcze nie odwzajemnili.',
  },
  obserwowaniPusto: {
    en: 'Nobody you follow one-sidedly. Clean sheet.',
    pl: 'Nikogo nie obserwujesz jednostronnie. Czysto.',
  },

  aktywnosc: { en: 'Activity', pl: 'Aktywność' },
  feedGlobalny: { en: 'See the global feed', pl: 'Zobacz feed globalny' },
  /* Przełącznik zakresu feedu (FeedZakres) — krótkie etykiety chipów, nie całe zdania. */
  zakresZnajomi: { en: 'Friends', pl: 'Znajomi' },
  zakresGlobalny: { en: 'Global', pl: 'Globalny' },
  synchronizujSteam: { en: 'Sync with Steam', pl: 'Synchronizuj ze Steam' },

  odkryjGraczy: { en: 'Discover players', pl: 'Odkryj graczy' },
  odkryjPodpis: {
    en: 'Save files worth a look from all over the basement',
    pl: 'Ciekawe save file’y z całej piwnicy',
  },
  pierwszyTekst: {
    en: '<b>You got here first.</b> The basement just opened — once others drop in, they show up right here.',
    pl: '<b>Jesteś tu pierwszy.</b> Piwnica świeżo otwarta — gdy dołączą inni, pojawią się w tym miejscu.',
  },
  pierwszyPoza: {
    en: 'In the meantime, look around the <a href="/encyklopedia">Encyclopedia</a> or fix up <a href="/kim-jestem">your own profile</a>.',
    pl: 'W międzyczasie zajrzyj do <a href="/encyklopedia">Encyklopedii</a> albo urządź <a href="/kim-jestem">swój profil</a>.',
  },
  znaszWszystkich: {
    en: '<b>You already know everyone.</b> The entire basement is in your network.',
    pl: '<b>Znasz już wszystkich.</b> Cała piwnica jest w Twojej sieci.',
  },

  // ── Pulpit (strona główna) ──
  coSlychac: { en: 'What’s up?', pl: 'Co słychać?' },
  wszyscyZnajomi: { en: '→ All friends', pl: '→ Wszyscy znajomi' },
  znajdzGraczy: { en: 'Find players', pl: 'Znajdź graczy' },
  pulpitGoscPoza: {
    en: 'And even without an account you can tour the <a href="/encyklopedia">Encyclopedia</a> or crunch a build in the <a href="/kalkulator">Calculator</a>.',
    pl: 'A bez konta i tak możesz zwiedzić <a href="/encyklopedia">Encyklopedię</a> albo policzyć build w <a href="/kalkulator">Kalkulatorze</a>.',
  },
  pulpitPoza: {
    en: 'Meanwhile: <a href="/encyklopedia">Encyclopedia</a> (717 items, 103 bosses) and the stat <a href="/kalkulator">Calculator</a>.',
    pl: 'W międzyczasie: <a href="/encyklopedia">Encyklopedia</a> (717 itemów, 103 bossów) i <a href="/kalkulator">Kalkulator</a> statystyk.',
  },
  mojProfil: { en: '→ My profile', pl: '→ Mój profil' },
  postep: { en: 'Progress', pl: 'Postęp' },
  goscProfilTekst: {
    en: '<b>Your save file will live here.</b> Sign up and this spot fills up with your progress, Dead God and your rarest finds.',
    pl: '<b>Tu zamieszka Twój save file.</b> Załóż konto, a to miejsce wypełni Twój postęp, Dead God i najrzadsze zdobycze.',
  },
  goscProfilPoza: {
    en: 'Without an account you can still tour the <a href="/encyklopedia">Encyclopedia</a> (717 items) and crunch a build in the <a href="/kalkulator">Calculator</a>.',
    pl: 'Bez konta i tak zwiedzisz <a href="/encyklopedia">Encyklopedię</a> (717 itemów) i policzysz build w <a href="/kalkulator">Kalkulatorze</a>.',
  },
  trendujace: { en: 'Trending (rarest)', pl: 'Trendujące (najrzadsze)' },
  wszystkie: { en: 'All →', pl: 'Wszystkie →' },

  // ── Feed ──
  /** „ile temu" — używane i przez kartkę feedu, i przez dzwonek. */
  przedChwila: { en: 'just now', pl: 'przed chwilą' },
  minTemu: { en: '{liczba} min ago', pl: '{liczba} min temu' },
  godzTemu: { en: '{liczba} h ago', pl: '{liczba} godz. temu' },
  wczoraj: { en: 'yesterday', pl: 'wczoraj' },
  dniTemu: {
    en: { one: '{liczba} day ago', other: '{liczba} days ago' },
    pl: {
      one: '{liczba} dzień temu',
      few: '{liczba} dni temu',
      many: '{liczba} dni temu',
      other: '{liczba} dni temu',
    },
  },
  ty: { en: 'You', pl: 'Ty' },
  polub: { en: 'Like', pl: 'Polub' },
  cofnijPolubienie: { en: 'Undo like', pl: 'Cofnij polubienie' },
  /** Wtręt maskotki przy polubieniu — ma być radosny, nie dosłowny. */
  serduchoPoszlo: { en: 'Heart delivered!', pl: 'Serducho poszło!' },
  zwin: { en: 'Collapse', pl: 'Zwiń' },
  rozwin: { en: 'Show more ({liczba})', pl: 'Rozwiń ({liczba})' },

  // ── Szukajka graczy ──
  szukajPlaceholder: {
    en: 'Search players by nick or bio…',
    pl: 'Szukaj gracza po nicku lub opisie…',
  },
  szukajAria: { en: 'Search for a player', pl: 'Szukaj gracza' },
  wyczysc: { en: 'Clear', pl: 'Wyczyść' },
  znaleziono: {
    en: { one: 'Found {liczba} player', other: 'Found {liczba} players' },
    pl: {
      one: 'Znaleziono {liczba} gracza',
      few: 'Znaleziono {liczba} graczy',
      many: 'Znaleziono {liczba} graczy',
      other: 'Znaleziono {liczba} graczy',
    },
  },

  // ── Dzwonek powiadomień ──
  powiadomienia: { en: 'Notifications', pl: 'Powiadomienia' },
  nowePowiadomienia: {
    en: { one: '{liczba} new', other: '{liczba} new' },
    pl: {
      one: '{liczba} nowe',
      few: '{liczba} nowe',
      many: '{liczba} nowych',
      other: '{liczba} nowych',
    },
  },
  nowe: { en: 'new', pl: 'nowe' },
  powiadomieniaZaloguj: {
    en: '<a href="/logowanie">Sign in</a> to start getting notifications.',
    pl: '<a href="/logowanie">Zaloguj się</a>, aby dostawać powiadomienia.',
  },
  /** Treść powiadomień — `lib/powiadomienia.ts` oddaje sam typ, tekst składa dzwonek. */
  powiadomienieObserwuje: { en: 'started following you', pl: 'zaczyna Cię obserwować' },
  powiadomienieWiadomosc: { en: 'sent you a private message', pl: 'napisał prywatnie' },
  /**
   * Zdania z dopełnieniem: po nich dzwonek dokleja `detal` (nazwa achievementu, bossa,
   * opis runu). Nazwy z gry zostają po angielsku, więc polska wersja musi kończyć się tak,
   * żeby angielski rzeczownik dało się dokleić bez odmiany („odblokowuje Dead God”).
   */
  powiadomienieAchievement: { en: 'You unlocked', pl: 'Odblokowujesz' },
  powiadomienieAchievementRzadki: { en: 'Rare unlock:', pl: 'Rzadkie odblokowanie:' },
  powiadomienieZnajomyUnlock: { en: 'unlocked', pl: 'odblokowuje' },
  powiadomienieZnajomyBoss: { en: 'defeated', pl: 'pokonuje' },
  powiadomienieZnajomyRun: { en: 'finished a run:', pl: 'kończy run:' },

  // ── Dzwonek: pusto, stopka, przeczytane ──
  powiadomieniaPusto: { en: 'Quiet down in the basement.', pl: 'W piwnicy cicho.' },
  powiadomieniaPustoPoza: {
    en: 'Follow other players and their unlocks land right here.',
    pl: 'Obserwuj innych graczy, a ich odblokowania wylądują właśnie tutaj.',
  },
  powiadomieniaStempel: { en: "Dad's note", pl: 'Notatka taty' },
  powiadomieniaZnajomi: { en: 'All friends →', pl: 'Wszyscy znajomi →' },
  powiadomieniaPrzeczytaj: { en: 'Mark all read', pl: 'Oznacz przeczytane' },
  /** Podpis pod stopką — tłumaczy, czemu „przeczytane” nie wędruje między urządzeniami. */
  powiadomieniaTaPrzegladarka: {
    en: 'Read state is kept in this browser only.',
    pl: 'Stan „przeczytane” trzyma tylko ta przeglądarka.',
  },
} satisfies Przestrzen
