import type { Przestrzen } from '../typy'

/**
 * Encyklopedia — hub, osiem sekcji, wspólna lista i detal.
 *
 * ZASADA: tłumaczymy WYŁĄCZNIE warstwę interfejsu. Nazwy z gry (Sad Onion, Monstro, Gaper,
 * Guppy, Red Heart) i opisy efektów zaciągnięte z wiki zostają po angielsku w obu językach —
 * tak nazywa je gra i tak szuka ich gracz.
 */
export const encyklopedia = {
  // ── Hub /encyklopedia ──
  tytul: { en: 'Encyclopedia', pl: 'Encyklopedia' },
  hubOpis: {
    en: 'Everything about Isaac in one place — pick a section.',
    pl: 'Wszystko o Isaacu w jednym miejscu — wybierz dział.',
  },
  sekcjiWBudowie: {
    en: {
      one: '{liczba} section under construction',
      other: '{liczba} sections under construction',
    },
    pl: {
      one: '{liczba} sekcja w budowie',
      few: '{liczba} sekcje w budowie',
      many: '{liczba} sekcji w budowie',
      other: '{liczba} sekcji w budowie',
    },
  },

  // ── Nazwy i opisy działów (hub + pasek powrotu w każdej sekcji) ──
  dzialPrzedmioty: { en: 'Items', pl: 'Przedmioty' },
  dzialPrzedmiotyOpis: {
    en: 'Every item with its quality, tags and a “take it or leave it” verdict.',
    pl: 'Wszystkie itemy z jakością, tagami i radą „brać czy zostawić".',
  },
  dzialTrinkety: { en: 'Trinkets', pl: 'Trinkety' },
  dzialTrinketyOpis: {
    en: 'Trinkets, their effects and how to unlock them.',
    pl: 'Bibeloty, ich efekty i sposób odblokowania.',
  },
  dzialPickupy: { en: 'Pickups', pl: 'Pickupy' },
  dzialPickupyOpis: {
    en: 'Hearts, coins, keys, bombs, batteries, chests and sacks.',
    pl: 'Serca, monety, klucze, bomby, baterie, skrzynie i worki.',
  },
  dzialPostacie: { en: 'Characters', pl: 'Postacie' },
  dzialPostacieOpis: {
    en: 'Health, starting items, birthright and your completion marks.',
    pl: 'Zdrowie, itemy startowe, birthright i Twój postęp marek.',
  },
  dzialTransformacje: { en: 'Transformations', pl: 'Transformacje' },
  dzialTransformacjeOpis: {
    en: 'Guppy, Beelzebub and the rest — the full item set of every transformation.',
    pl: 'Guppy, Beelzebub i reszta — cały zestaw itemów każdej przemiany.',
  },
  dzialPokojeKostek: { en: 'Dice Rooms', pl: 'Pokoje kostek' },
  dzialPokojeKostekOpis: {
    en: 'What every number of pips on the Dice Room floor does.',
    pl: 'Co robi każda liczba oczek na podłodze Dice Roomu.',
  },
  dzialBossowie: { en: 'Bosses', pl: 'Bossowie' },
  dzialBossowieOpis: {
    en: '103 bosses with portraits, health and descriptions.',
    pl: '103 bossów z portretami, zdrowiem i opisem.',
  },
  dzialPrzeciwnicy: { en: 'Enemies', pl: 'Przeciwnicy' },
  dzialPrzeciwnicyOpis: {
    en: '367 monsters: health, damage and behaviour.',
    pl: '367 potworów: zdrowie, obrażenia i zachowanie.',
  },

  // ── Wspólna lista (EncLista) ──
  szukajDomyslnie: { en: 'Search…', pl: 'Szukaj…' },
  wyczyscSzukajke: { en: 'Clear', pl: 'Wyczyść' },
  filtrWszystkie: { en: 'All', pl: 'Wszystkie' },
  sortDomyslnie: { en: 'Default', pl: 'Domyślnie' },
  sortAlfabetycznie: { en: 'A–Z', pl: 'A–Z' },
  licznikWidocznych: { en: '{widoczne} of {wszystkie}', pl: '{widoczne} z {wszystkie}' },
  brakWynikow: { en: 'No results for “{q}”.', pl: 'Brak wyników dla „{q}".' },
  brakWynikowRada: {
    en: 'Try a different name or a word from the description.',
    pl: 'Spróbuj innej nazwy albo słowa z opisu.',
  },

  // ── Detal wpisu (EncDetal) ──
  detalJakosc: { en: 'Quality', pl: 'Jakość' },
  detalJakoscOpis: { en: 'Quality {n} out of 4', pl: 'Jakość {n} na 4' },
  detalPule: { en: 'Item pools', pl: 'Pule itemów' },
  detalZmienia: { en: 'Changes', pl: 'Zmienia' },
  detalItemyStartowe: { en: 'Starting items', pl: 'Itemy startowe' },
  detalWyglad: { en: 'Appearance', pl: 'Wygląd' },
  detalPodpisIsaac: { en: 'Isaac holding this item', pl: 'Isaac z tym itemem' },
  detalPodpisWGrze: { en: 'In game', pl: 'W grze' },
  detalEfektLez: { en: 'Tear effect', pl: 'Efekt łez' },
  detalAltWyglad: { en: 'Appearance: {nazwa}', pl: 'Wygląd: {nazwa}' },
  detalAltWGrze: { en: '{nazwa} in game', pl: '{nazwa} w grze' },
  detalAltLzy: { en: 'Tears after picking up {nazwa}', pl: 'Łzy po wzięciu {nazwa}' },
  detalOpis: { en: 'Description', pl: 'Opis' },
  detalOdblokowanie: { en: 'Unlock', pl: 'Odblokowanie' },
  detalMaszAchievement: { en: 'You have this achievement.', pl: 'Masz ten achievement.' },
  detalBrakAchievementu: {
    en: 'You do not have this achievement yet.',
    pl: 'Nie masz jeszcze tego achievementu.',
  },

  // ── Etykiety pól w tabelce detalu ──
  poleId: { en: 'ID', pl: 'ID' },
  poleZdrowie: { en: 'Health', pl: 'Zdrowie' },
  poleObrazeniaOdDotkniecia: { en: 'Contact damage', pl: 'Obrażenia od dotknięcia' },
  poleNaStart: { en: 'At the start', pl: 'Na start' },
  poleTwojeMarki: { en: 'Your marks', pl: 'Twoje marki' },
  poleWymog: { en: 'Requirement', pl: 'Wymóg' },
  poleDaje: { en: 'Gives', pl: 'Daje' },
  poleSzansaWypadniecia: { en: 'Drop chance', pl: 'Szansa wypadnięcia' },
  poleZestawItemow: { en: 'Item set', pl: 'Zestaw itemów' },

  // ── Sortowanie ──
  sortJakosc: { en: 'Quality', pl: 'Jakość' },
  sortOdblokowane: { en: 'Unlocked', pl: 'Odblokowane' },
  sortPostep: { en: 'Progress', pl: 'Postęp' },
  sortLiczbaItemow: { en: 'Item count', pl: 'Liczba itemów' },
  sortZdrowie: { en: 'Health', pl: 'Zdrowie' },
  sortOczka: { en: 'Pips', pl: 'Oczka' },

  // ── Sekcja „Przedmioty" ──
  przedmiotySzukaj: {
    en: 'Search for an item (name or description)…',
    pl: 'Szukaj itemu (nazwa lub opis)…',
  },
  przedmiotyWstep: {
    en: 'Click an item to see the full details.',
    pl: 'Kliknij item, żeby zobaczyć pełne szczegóły.',
  },
  filtrAktywne: { en: 'Active', pl: 'Aktywne' },
  filtrPasywne: { en: 'Passive', pl: 'Pasywne' },
  typAktywny: { en: 'active', pl: 'aktywny' },
  typPasywny: { en: 'passive', pl: 'pasywny' },
  znacznikChowaniec: { en: 'familiar', pl: 'chowaniec' },
  znacznikLadunek: { en: 'charge {ile}', pl: 'ładunek {ile}' },

  // ── Sekcja „Trinkety" ──
  trinketySzukaj: {
    en: 'Search for a trinket (name or effect)…',
    pl: 'Szukaj trinketu (nazwa lub efekt)…',
  },
  trinketyWstep: {
    en: 'Click a trinket to see its effect and how to unlock it.',
    pl: 'Kliknij trinket, żeby zobaczyć jego efekt i sposób odblokowania.',
  },
  filtrOdblokowane: { en: 'Unlocked', pl: 'Odblokowane' },
  filtrZablokowane: { en: 'Locked', pl: 'Zablokowane' },
  znacznikTrinket: { en: 'trinket', pl: 'trinket' },
  znacznikOdblokowany: { en: 'unlocked', pl: 'odblokowany' },
  znacznikZablokowany: { en: 'locked', pl: 'zablokowany' },
  opisBibelot: { en: 'trinket', pl: 'bibelot' },

  // ── Sekcja „Pickupy" ──
  pickupySzukaj: {
    en: 'Search for a pickup (name or effect)…',
    pl: 'Szukaj znajdźki (nazwa lub efekt)…',
  },
  pickupyWstep: {
    en: 'Click a pickup to see what it gives and how often it drops.',
    pl: 'Kliknij znajdźkę, żeby zobaczyć, co daje i jak często wypada.',
  },
  rodzinaSerca: { en: 'Hearts', pl: 'Serca' },
  rodzinaMonety: { en: 'Coins', pl: 'Monety' },
  rodzinaKlucze: { en: 'Keys', pl: 'Klucze' },
  rodzinaBomby: { en: 'Bombs', pl: 'Bomby' },
  rodzinaBaterie: { en: 'Batteries', pl: 'Baterie' },
  rodzinaSkrzynie: { en: 'Chests', pl: 'Skrzynie' },
  rodzinaWorki: { en: 'Sacks', pl: 'Worki' },
  znacznikDoOdblokowania: { en: 'needs unlocking', pl: 'do odblokowania' },

  // ── Sekcja „Postacie" ──
  postacieSzukaj: { en: 'Search for a character…', pl: 'Szukaj postaci…' },
  postacieWstep: {
    en: 'Click a character to see the details and your progress.',
    pl: 'Kliknij postać, żeby zobaczyć szczegóły i swój postęp.',
  },
  filtrBazowe: { en: 'Base', pl: 'Bazowe' },
  filtrSplugawione: { en: 'Tainted', pl: 'Splugawione' },
  znacznikBazowa: { en: 'base', pl: 'bazowa' },
  znacznikSplugawiona: { en: 'tainted', pl: 'splugawiona' },
  znacznikProcentMarek: { en: '{procent}% of marks', pl: '{procent}% marek' },
  markiBrakDanych: { en: 'no data from Steam', pl: 'brak danych ze Steama' },
  opisPostac: { en: 'character', pl: 'postać' },
  opisPostacSplugawiona: { en: 'tainted character', pl: 'postać splugawiona' },

  // ── Sekcja „Transformacje" ──
  transformacjeSzukaj: {
    en: 'Search for a transformation or effect…',
    pl: 'Szukaj transformacji lub efektu…',
  },
  transformacjeWstep: {
    en: 'Click a transformation to see its effect and the whole item set.',
    pl: 'Kliknij transformację, żeby zobaczyć jej efekt i cały zestaw itemów.',
  },
  znacznikTransformacja: { en: 'transformation', pl: 'transformacja' },
  itemowWZestawie: {
    en: { one: '{liczba} item in the set', other: '{liczba} items in the set' },
    pl: {
      one: '{liczba} item w zestawie',
      few: '{liczba} itemy w zestawie',
      many: '{liczba} itemów w zestawie',
      other: '{liczba} itemów w zestawie',
    },
  },
  detalPodpisPoTransformacji: {
    en: 'Isaac after the transformation',
    pl: 'Isaac po transformacji',
  },
  // Wiki podaje wymóg słownie i zawsze w kilku wariantach — mapujemy te, które faktycznie
  // występują; nieznane zostają w oryginale (lepsze niż zgadywanie).
  wymogTrzyZZestawu: { en: 'three items from this set', pl: 'trzy itemy z tego zestawu' },
  wymogTrzyItemy: { en: 'three items', pl: 'trzy itemy' },
  wymogDwaZZestawu: { en: 'two items from this set', pl: 'dwa itemy z tego zestawu' },

  // ── Sekcja „Bossowie" ──
  bossowieSzukaj: { en: 'Search for a boss…', pl: 'Szukaj bossa…' },
  bossowieWstep: {
    en: 'Click a boss to see its portrait, stats and description.',
    pl: 'Kliknij bossa, żeby zobaczyć jego portret, statystyki i opis.',
  },
  znacznikBoss: { en: 'boss', pl: 'boss' },
  detalPodpisPortretBossa: { en: 'Boss portrait', pl: 'Portret bossa' },

  // ── Sekcja „Przeciwnicy" ──
  przeciwnicySzukaj: { en: 'Search for an enemy…', pl: 'Szukaj przeciwnika…' },
  przeciwnicyWstep: {
    en: 'Click an enemy to see its stats and behaviour.',
    pl: 'Kliknij przeciwnika, żeby zobaczyć jego statystyki i zachowanie.',
  },
  znacznikPrzeciwnik: { en: 'enemy', pl: 'przeciwnik' },
  filtrHpDo20: { en: 'up to 20 HP', pl: 'do 20 HP' },
  filtrHp20Do60: { en: '20–60 HP', pl: '20–60 HP' },
  filtrHpPonad60: { en: 'over 60 HP', pl: 'powyżej 60 HP' },
  // Filtry rozdziału (piętra) — wspólne dla bossów i przeciwników, liczone z opisu (lib/enc/pietra).
  filtrPietroBasement: { en: 'Basement', pl: 'Piwnica' },
  filtrPietroCaves: { en: 'Caves', pl: 'Jaskinie' },
  filtrPietroDepths: { en: 'Depths', pl: 'Głębiny' },
  filtrPietroWomb: { en: 'Womb', pl: 'Łono' },
  filtrPietroKoniec: { en: 'Endgame', pl: 'Finał' },
  detalPodpisSpriteZGry: { en: 'In-game sprite', pl: 'Sprite z gry' },
  // Podpis na karcie bossa/przeciwnika: „150 HP · 2 obrażeń".
  opisHpObrazenia: { en: '{hp} HP · {dmg} damage', pl: '{hp} HP · {dmg} obrażeń' },

  // ── Sekcja „Pokoje kostek" ──
  kostkiSzukaj: { en: 'Search for a dice effect…', pl: 'Szukaj efektu kostki…' },
  kostkiWstep: {
    en: 'Click a die to see the full effect (each room works only once).',
    pl: 'Kliknij kostkę, żeby zobaczyć pełny efekt (każdy pokój działa tylko raz).',
  },
  znacznikPokojKostki: { en: 'dice room', pl: 'pokój kostki' },
  oczka: {
    en: { one: '{liczba} pip', other: '{liczba} pips' },
    pl: {
      one: '{liczba} oczko',
      few: '{liczba} oczka',
      many: '{liczba} oczek',
      other: '{liczba} oczek',
    },
  },

  // ── Statystyki zmieniane przez item (atrybut `cache` z items.xml) ──
  statDamage: { en: 'Damage', pl: 'Obrażenia' },
  statFiredelay: { en: 'Tears', pl: 'Szybkostrzelność' },
  statSpeed: { en: 'Speed', pl: 'Szybkość' },
  statRange: { en: 'Range', pl: 'Zasięg' },
  statShotspeed: { en: 'Shot speed', pl: 'Prędkość łez' },
  statLuck: { en: 'Luck', pl: 'Szczęście' },
  statTearcolor: { en: 'Tear colour', pl: 'Kolor łez' },
  statTearflag: { en: 'Tear effect', pl: 'Efekt łez' },
  statFamiliars: { en: 'Familiars', pl: 'Chowańce' },
  statFlying: { en: 'Flight', pl: 'Latanie' },
  statWeapon: { en: 'Changes weapon', pl: 'Zmienia broń' },
  statSize: { en: 'Character size', pl: 'Rozmiar postaci' },
  statColor: { en: 'Character look', pl: 'Wygląd postaci' },
  statPickupvision: { en: 'Pickup vision', pl: 'Podgląd znajdziek' },
  statAll: { en: 'All stats', pl: 'Wszystkie statystyki' },

  // ── Pule itemów (skąd item wypada) ──
  pulaTreasure: { en: 'Treasure Room', pl: 'Skarbiec' },
  pulaShop: { en: 'Shop', pl: 'Sklep' },
  pulaBoss: { en: 'Boss', pl: 'Boss' },
  pulaDevil: { en: 'Devil Room', pl: 'Diabelski pokój' },
  pulaAngel: { en: 'Angel Room', pl: 'Anielski pokój' },
  pulaSecret: { en: 'Secret Room', pl: 'Sekretny pokój' },
  pulaUltraSecret: { en: 'Ultra Secret Room', pl: 'Ultra sekretny pokój' },
  pulaLibrary: { en: 'Library', pl: 'Biblioteka' },
  pulaCurse: { en: 'Curse Room', pl: 'Przeklęty pokój' },
  pulaPlanetarium: { en: 'Planetarium', pl: 'Planetarium' },
  pulaGoldenChest: { en: 'Golden Chest', pl: 'Złota skrzynia' },
  pulaRedChest: { en: 'Red Chest', pl: 'Czerwona skrzynia' },
  pulaWoodenChest: { en: 'Wooden Chest', pl: 'Drewniana skrzynia' },
  pulaOldChest: { en: 'Old Chest', pl: 'Stara skrzynia' },
  pulaMomsChest: { en: "Mom's Chest", pl: 'Skrzynia mamy' },
  pulaBeggar: { en: 'Beggar', pl: 'Żebrak' },
  pulaDemonBeggar: { en: 'Devil Beggar', pl: 'Demon-żebrak' },
  pulaRottenBeggar: { en: 'Rotten Beggar', pl: 'Zgniły żebrak' },
  pulaKeyMaster: { en: 'Key Master', pl: 'Klucznik' },
  pulaBatteryBum: { en: 'Battery Bum', pl: 'Bum od baterii' },
  pulaBombBum: { en: 'Bomb Bum', pl: 'Bum od bomb' },
  pulaBabyShop: { en: 'Baby Shop', pl: 'Sklep z bobasami' },
  pulaShellGame: { en: 'Shell Game', pl: 'Gra w kubki' },
  pulaCraneGame: { en: 'Crane Game', pl: 'Automat z pluszakami' },
  pulaGreedTreasure: { en: 'Greed — Treasure Room', pl: 'Greed — skarbiec' },
  pulaGreedBoss: { en: 'Greed — Boss', pl: 'Greed — boss' },
  pulaGreedShop: { en: 'Greed — Shop', pl: 'Greed — sklep' },
  pulaGreedDevil: { en: 'Greed — Devil Room', pl: 'Greed — diabelski' },
  pulaGreedAngel: { en: 'Greed — Angel Room', pl: 'Greed — anielski' },
  pulaGreedCurse: { en: 'Greed — Curse Room', pl: 'Greed — przeklęty' },
  pulaGreedSecret: { en: 'Greed — Secret Room', pl: 'Greed — sekretny' },

  // ── Tagi itemów (z plików gry) ──
  tagOffensive: { en: 'offensive', pl: 'ofensywny' },
  tagSummonable: { en: 'summonable', pl: 'przyzywalny' },
  tagTearsup: { en: 'more tears', pl: 'więcej łez' },
  tagMonstermanual: { en: 'monster manual', pl: 'monster manual' },
  tagBaby: { en: 'baby', pl: 'bobas' },
  tagStars: { en: 'stars', pl: 'gwiazdy' },
  tagFly: { en: 'fly', pl: 'mucha' },
  tagSpider: { en: 'spider', pl: 'pająk' },
  tagBook: { en: 'book', pl: 'książka' },
  tagAngel: { en: 'angel', pl: 'anielski' },
  tagDevil: { en: 'devil', pl: 'diabelski' },
  tagMom: { en: 'mom', pl: 'mama' },
  tagDead: { en: 'death', pl: 'śmierć' },
  tagPoop: { en: 'poop', pl: 'kupa' },
  tagMushroom: { en: 'mushroom', pl: 'grzyb' },
  tagSyringe: { en: 'syringe', pl: 'strzykawka' },
  tagFood: { en: 'food', pl: 'jedzenie' },
  tagTech: { en: 'tech', pl: 'tech' },
  tagGuppy: { en: 'guppy', pl: 'guppy' },
  tagBattery: { en: 'battery', pl: 'bateria' },
  tagBob: { en: 'bob', pl: 'bob' },
  tagQuest: { en: 'quest', pl: 'questowy' },

  // ── Kalkulator statystyk: tabela statów ──
  kalkStatDamage: { en: 'Damage', pl: 'Obrażenia' },
  kalkStatDamageOpis: { en: 'How much one tear takes off.', pl: 'Ile zabiera jedna łza.' },
  kalkStatTears: { en: 'Tears', pl: 'Łzy' },
  kalkStatTearsOpis: {
    en: 'Fire rate — tears per second.',
    pl: 'Szybkostrzelność — łzy na sekundę.',
  },
  kalkStatSpeed: { en: 'Speed', pl: 'Szybkość' },
  kalkStatSpeedOpis: { en: 'How fast Isaac moves.', pl: 'Jak szybko Isaac się porusza.' },
  kalkStatRange: { en: 'Range', pl: 'Zasięg' },
  kalkStatRangeOpis: { en: 'How far the tears fly.', pl: 'Jak daleko lecą łzy.' },
  kalkStatShotSpeed: { en: 'Shot speed', pl: 'Prędkość łez' },
  kalkStatShotSpeedOpis: { en: 'How fast the tears fly.', pl: 'Jak szybko lecą łzy.' },
  kalkStatLuck: { en: 'Luck', pl: 'Szczęście' },
  kalkStatLuckOpis: {
    en: 'Improves the odds of random effects.',
    pl: 'Podbija szanse efektów losowych.',
  },

  // ── Kalkulator: krótki opis modyfikatora itemu („+0.5 damage · ×1.5 damage") ──
  // Polski wymaga dopełniacza („+0.5 obrażeń"), więc to osobne wpisy, nie te same co nagłówki.
  modDamage: { en: 'damage', pl: 'obrażeń' },
  modTears: { en: 'tears', pl: 'łez' },
  modSpeed: { en: 'speed', pl: 'szybkości' },
  modRange: { en: 'range', pl: 'zasięgu' },
  modShotSpeed: { en: 'shot speed', pl: 'prędkości łez' },
  modLuck: { en: 'luck', pl: 'szczęścia' },
} satisfies Przestrzen
