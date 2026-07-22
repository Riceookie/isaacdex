import type { Przestrzen } from '../typy'

/**
 * Kolekcja (achievementy + completion marks), statystyki i kalkulator statów.
 *
 * Nazwy własne z gry — achievementy, itemy, bossowie, postacie, completion marks
 * („Dead God", „Boss Rush", „Tainted") — zostają po angielsku w OBU językach: tak nazywa
 * je gra i tak szuka ich gracz na wiki. Tłumaczymy tylko to, co apka mówi od siebie.
 */
export const kolekcja = {
  // ── Kolekcja: pasek synchronizacji ──
  zalogujBySteam: { en: 'Sign in to link Steam', pl: 'Zaloguj się, aby podłączyć Steam' },
  synchronizuj: { en: 'Sync with Steam', pl: 'Synchronizuj ze Steam' },
  synchronizuje: { en: 'Syncing…', pl: 'Synchronizuję…' },
  sciagam: { en: 'Fetching…', pl: 'Ściągam…' },
  podgladKatalogu: {
    en: 'Catalogue preview — sign in to see what you have unlocked.',
    pl: 'Podgląd katalogu — zaloguj się, aby zobaczyć swoje odblokowania.',
  },
  zaciagam: {
    en: 'Pulling achievements from Steam…',
    pl: 'Zaciągam achievementy ze Steama…',
  },
  ostatniaSync: { en: 'Last sync: {kiedy}', pl: 'Ostatnia synchronizacja: {kiedy}' },
  brakSync: { en: 'Not synced yet', pl: 'Jeszcze nie synchronizowano' },

  // ── Kolekcja: liczniki i filtry ──
  // Licznik trzyma <b> w tekście, bo w obu językach liczba stoi w innym miejscu zdania —
  // cięcie na osobne klucze i sklejanie w JSX rozjechałoby szyk (patrz ustawienia.kartkiOpis).
  odblokowaneZ: {
    en: {
      one: 'Unlocked <b>{liczba}</b> / {wszystkie}',
      other: 'Unlocked <b>{liczba}</b> / {wszystkie}',
    },
    pl: {
      one: 'Odblokowany <b>{liczba}</b> / {wszystkie}',
      few: 'Odblokowane <b>{liczba}</b> / {wszystkie}',
      many: 'Odblokowane <b>{liczba}</b> / {wszystkie}',
      other: 'Odblokowane <b>{liczba}</b> / {wszystkie}',
    },
  },
  pokazujeWyniki: {
    en: { one: 'showing {liczba} result', other: 'showing {liczba} results' },
    pl: {
      one: 'pokazuję {liczba} wynik',
      few: 'pokazuję {liczba} wyniki',
      many: 'pokazuję {liczba} wyników',
      other: 'pokazuję {liczba} wyniku',
    },
  },
  szukajAchievementu: { en: 'Search achievements…', pl: 'Szukaj achievementu…' },
  filtrWszystkie: { en: 'All', pl: 'Wszystkie' },
  filtrOdblokowane: { en: 'Unlocked', pl: 'Odblokowane' },
  filtrZablokowane: { en: 'Locked', pl: 'Zablokowane' },
  filtrRzadkie: { en: 'Rare', pl: 'Rzadkie' },

  // ── Kolekcja: modal achievementu ──
  znacznikOdblokowane: { en: 'unlocked', pl: 'odblokowane' },
  znacznikZablokowane: { en: 'locked', pl: 'zablokowane' },
  znacznikRzadkie: { en: 'rare', pl: 'rzadkie' },
  maJeGlobalnie: { en: 'Owned globally', pl: 'Ma je globalnie' },
  procentGraczy: { en: '{procent}% of players', pl: '{procent}% graczy' },
  zdobyte: { en: 'Earned', pl: 'Zdobyte' },
  jakZdobyc: { en: 'How to get it', pl: 'Jak zdobyć' },
  brakOpisuNaWiki: { en: 'No description on the wiki.', pl: 'Brak opisu na wiki.' },

  // ── Kolekcja: puste stany ──
  goscTekst: {
    en: '<b>641 icons are waiting for your name.</b> Create an account and link Steam — the catalogue turns into your collection, with the date and rarity of every unlock.',
    pl: '<b>641 ikon czeka na Twoje nazwisko.</b> Załóż konto i podłącz Steam, a katalog zamieni się w Twoją kolekcję — z datami i rzadkością każdego odblokowania.',
  },
  goscPoza: {
    en: 'You can browse the catalogue without an account — click any icon to see how it is earned.',
    pl: 'Katalog przeglądasz i bez konta — kliknij dowolną ikonę, żeby zobaczyć, jak się ją zdobywa.',
  },
  pustoTekst: {
    en: '<b>An empty display case.</b> Pull your achievements from Steam — 641 icons, unlock dates and completion marks land here on their own.',
    pl: '<b>Pusta gablota.</b> Zassij osiągnięcia ze Steama — 641 ikon, daty zdobycia i completion marks wskoczą tu same.',
  },
  pustoPoza: {
    en: 'Steam is linked once — in the <a href="/kim-jestem">profile editor</a>.',
    pl: 'Steama podpina się raz — w <a href="/kim-jestem">edytorze profilu</a>.',
  },

  // ── Kolekcja: błędy i głos maskotki ──
  bladSync: { en: 'Could not sync.', pl: 'Nie udało się zsynchronizować.' },
  bladSieci: { en: 'Network error while syncing.', pl: 'Błąd sieci przy synchronizacji.' },
  glosSync: {
    en: 'Fresh achievements pulled in. I watched every single one.',
    pl: 'Świeże achievementy zassane. Widziałem każdy.',
  },
  glosRzadkieMam: { en: 'Rare one! Respect.', pl: 'Rzadkie! Szanuję.' },
  glosMam: { en: 'Got it. Nice.', pl: 'Masz to. Ładnie.' },
  glosGosc: { en: 'Sign in and earn it for real.', pl: 'Zaloguj się i zdobądź je naprawdę.' },
  glosRzadkieBrak: { en: 'Rare one. Worth the grind.', pl: 'To rzadkie. Warte grindu.' },
  glosBrak: { en: 'Still locked. Get to work.', pl: 'Jeszcze zablokowane. Do dzieła.' },

  // ── Completion marks (save file) ──
  zmienPostac: { en: 'Change character', pl: 'Zmień postać' },
  markOdznacz: { en: ' — click to clear', pl: ' — kliknij, by odznaczyć' },
  markZalicz: { en: ' — click to mark done', pl: ' — kliknij, by zaliczyć' },
  markBladZapisu: { en: 'Could not save the mark.', pl: 'Nie udało się zapisać marka.' },
  markBlad: { en: 'Save failed.', pl: 'Błąd zapisu.' },
  markiPrzypis: {
    en: 'Marks are worked out from your Steam achievements, but you can <b>click</b> them to fix things up by hand if something does not add up. Red = Hard.',
    pl: 'Marki wyliczają się z achievementów (Steam), ale możesz je <b>kliknąć</b>, by ręcznie poprawić, gdyby coś się nie zgadzało. Czerwone = Hard.',
  },

  // ── Statystyki: kafelki i nagłówki ──
  statyOdblokowane: { en: 'unlocked', pl: 'odblokowane' },
  statyUkonczenia: { en: 'completed', pl: 'ukończenia' },
  statyNajrzadszy: { en: 'rarest', pl: 'najrzadszy' },
  statyNajrzadszyZ: { en: 'rarest: {nazwa}', pl: 'najrzadszy: {nazwa}' },
  statyOstatnio: { en: 'latest', pl: 'ostatnio' },
  statyOstatnioZ: { en: 'latest: {nazwa}', pl: 'ostatnio: {nazwa}' },
  statyWCzasie: { en: 'Unlocks over time', pl: 'Odblokowania w czasie' },
  statyRzadkosc: { en: 'Rarity of your unlocks', pl: 'Rzadkość Twoich odblokowanych' },
  statyUkonczeniePostaci: { en: 'Character completion', pl: 'Ukończenie postaci' },

  // ── Statystyki: wykresy ──
  wykresZaMaloDanych: {
    en: 'Not enough dated unlocks to draw a chart.',
    pl: 'Za mało danych z datami, żeby narysować wykres.',
  },
  wykresPunkt: {
    en: { one: '{miesiac}: {liczba} unlock', other: '{miesiac}: {liczba} unlocks' },
    pl: {
      one: '{miesiac}: {liczba} odblokowany',
      few: '{miesiac}: {liczba} odblokowane',
      many: '{miesiac}: {liczba} odblokowanych',
      other: '{miesiac}: {liczba} odblokowanego',
    },
  },
  kubelekCzeste: { en: 'Common', pl: 'Częste' },
  kubelekRzadkie: { en: 'Rare', pl: 'Rzadkie' },
  kubelekLegendarne: { en: 'Legendary', pl: 'Legendarne' },
  legendaCzesteRzadkie: { en: 'Common / rare', pl: 'Częste / rzadkie' },
  legendaLegendarne: {
    en: 'Legendary (<5% of players)',
    pl: 'Legendarne (<5% graczy)',
  },

  // ── Statystyki: gość i pusty stan ──
  statyBanerGosc: {
    en: 'This is the skeleton of your stats — the zeros turn into real numbers once you create an account and link Steam.',
    pl: 'To szkielet Twoich statystyk — zera zamienią się w prawdziwe liczby, gdy założysz konto i podepniesz Steam.',
  },
  statyBanerLink: { en: 'Create an account →', pl: 'Załóż konto →' },
  statyPustoTekst: {
    en: '<b>No tears to count yet.</b> Link Steam and we will count the lot: your Dead God percentage, every character’s marks, your rarest finds and how many times Mom finished you off.',
    pl: '<b>Jeszcze zero łez do policzenia.</b> Podłącz Steam, a policzymy wszystko: procent Dead Goda, marki każdej postaci, najrzadsze zdobycze i to, ile razy zginąłeś na Mamie.',
  },
  statyPodlaczSteam: { en: 'Link Steam', pl: 'Podłącz Steam' },
  statyPustoPoza: {
    en: 'Steam is linked once. After that just hit “Sync” in <a href="/kolekcja">Achievements</a>.',
    pl: 'Steam trzeba podpiąć raz. Potem wystarczy „Synchronizuj” w <a href="/kolekcja">Osiągnięciach</a>.',
  },

  // ── Statystyki: postacie Tainted bez danych ze Steam ──
  bezDanychSteam: { en: 'no Steam data', pl: 'bez danych Steam' },
  bezDanychTytul: {
    en: "Tainted marks fill in as you unlock this character's boss items",
    pl: 'Marki Tainted uzupełniają się, gdy odblokowujesz itemy za bossy tej postaci',
  },
  bezDanychPrzypis: {
    en: '<b>Tainted</b> characters have no per-mark Steam achievements, so they show “no Steam data” until you start unlocking their <b>boss item</b> rewards — then their board fills in automatically and counts here, just like the base characters.',
    pl: 'Postacie <b>splugawione (Tainted)</b> nie mają osobnych achievementów per marka, więc pokazują „bez danych Steam”, dopóki nie zaczniesz odblokowywać ich <b>itemów za bossy</b> — wtedy tablica uzupełnia się automatycznie i liczy się tutaj, jak u postaci bazowych.',
  },

  // ── Kalkulator ──
  kalkTytul: { en: 'Stat calculator', pl: 'Kalkulator statystyk' },
  kalkWyczysc: { en: 'Clear items ({ile})', pl: 'Wyczyść itemy ({ile})' },
  kalkPostac: { en: 'Character', pl: 'Postać' },
  kalkBazowe: { en: 'Base', pl: 'Bazowe' },
  kalkSplugawione: { en: 'Tainted', pl: 'Splugawione' },
  kalkFormyPrzypis: {
    en: 'Forms have their own stats, so they stand on their own (Dark Judas, Lazarus Risen, The Soul, Esau…).',
    pl: 'Formy mają własne staty, więc stoją osobno (Dark Judas, Lazarus Risen, The Soul, Esau…).',
  },
  kalkStatystyki: { en: 'Stats', pl: 'Statystyki' },
  kalkKolStat: { en: 'Stat', pl: 'Statystyka' },
  kalkKolBaza: { en: 'Base', pl: 'Baza' },
  kalkKolPoItemach: { en: 'With items', pl: 'Po itemach' },
  kalkTwojeItemy: { en: 'Your items', pl: 'Twoje itemy' },
  kalkNicNieWziete: {
    en: 'Nothing picked up — the table shows the character’s own stats.',
    pl: 'Nic nie wzięte — tabela pokazuje same staty postaci.',
  },
  kalkDodajItem: { en: 'Add an item', pl: 'Dodaj item' },
  kalkSzukajPlaceholder: { en: 'Search items with stats…', pl: 'Szukaj itemu ze statami…' },
  kalkSzukajAria: { en: 'Search items', pl: 'Szukaj itemu' },
  kalkIleItemow: {
    en: {
      one: '{liczba} item changes stats numerically. The rest (Brimstone, say) swap your tears or work through an effect, so they stay out of the table.',
      other:
        '{liczba} items change stats numerically. The rest (Brimstone, say) swap your tears or work through an effect, so they stay out of the table.',
    },
    pl: {
      one: '{liczba} item zmienia statystyki liczbowo. Reszta (np. Brimstone) zmienia broń albo działa efektem, więc nie wchodzi do tabeli.',
      few: '{liczba} itemy zmieniają statystyki liczbowo. Reszta (np. Brimstone) zmienia broń albo działa efektem, więc nie wchodzi do tabeli.',
      many: '{liczba} itemów zmienia statystyki liczbowo. Reszta (np. Brimstone) zmienia broń albo działa efektem, więc nie wchodzi do tabeli.',
      other:
        '{liczba} itemu zmienia statystyki liczbowo. Reszta (np. Brimstone) zmienia broń albo działa efektem, więc nie wchodzi do tabeli.',
    },
  },
  kalkGlosDuzyBuild: {
    en: 'What a monster of a build. Respect.',
    pl: 'Ale kobyła buildu. Szanuję.',
  },
  kalkGlosDodano: {
    en: '{item}? Let us see what that does.',
    pl: '{item}? Zobaczmy, co zrobi.',
  },

  // ── Doradca „brać czy zostawić" ──
  doradcaPlaceholder: {
    en: 'e.g. Brimstone, The Bible, The Poop…',
    pl: 'np. Brimstone, The Bible, The Poop…',
  },
  doradcaSprawdz: { en: 'Check', pl: 'Sprawdź' },
  rekBierz: { en: 'take it', pl: 'bierz' },
  rekZwykleWarto: { en: 'usually worth it', pl: 'zwykle warto' },
  rekSytuacyjnie: { en: 'situational', pl: 'sytuacyjnie' },
  rekRaczejPomin: { en: 'probably skip', pl: 'raczej pomiń' },
  rekUwaga: { en: 'careful', pl: 'uwaga' },

  // ── API: /api/sync ──
  apiBrakKlucza: { en: 'No STEAM_API_KEY on the server.', pl: 'Brak STEAM_API_KEY na serwerze.' },
  apiZalogujBySync: { en: 'Sign in to sync.', pl: 'Zaloguj się, żeby synchronizować.' },
  apiPodlaczSteam: { en: 'Link your Steam account first.', pl: 'Najpierw podłącz konto Steam.' },
  apiBrakProfilu: { en: 'No profile.', pl: 'Brak profilu.' },
  apiProfilPrywatny: {
    en: 'Your Game details are private — set them to public in Steam.',
    pl: 'Szczegóły gry (Game details) są prywatne — ustaw je na publiczne w Steam.',
  },

  // ── API: /api/advice ──
  apiPodajNazwe: { en: 'Give an item name.', pl: 'Podaj nazwę itemu.' },
  apiNieznanyItem: { en: 'I do not know “{nazwa}”.', pl: 'Nie znam itemu „{nazwa}”.' },
} satisfies Przestrzen
