import type { Przestrzen } from '../typy'

/**
 * Sekretny Pokój — ukryty ekran w klimacie „secret room" z gry (te za zbombardowaną ścianą).
 * Wejście jest zataczone (mały Keeper na górnym pasku, rysa na dole sidebara). W środku NIE ma
 * już sklepu — jest ciemny, arkaniczny pokój, w którym w mroku wisi Shopkeeper (przeszkoda-
 * sklepikarz z Shopa, nie grywalny Keeper), otoczony kręgiem run. Sekret otwiera się na TRZY
 * PIECZĘCIE: trzy zagadki, które krok po kroku odsłaniają, czym jest ta postać (moneta →
 * sklep → prawdziwe imię „Keeper"). Rozwiązanie ostatniej nadaje tytuł „Keeper". Nazwy własne
 * (Keeper, Shopkeeper, Secret Room) zostają po angielsku — to żargon z gry — reszta tłumaczona.
 */
export const sekret = {
  tab: { en: '???', pl: '???' },
  naglowek: { en: 'Secret Room', pl: 'Sekretny Pokój' },

  // Wejście przez małego Keepera na pasku / rysę w sidebarze.
  wejscieTip: { en: 'There is a crack in the wall…', pl: 'W ścianie jest rysa…' },
  wejscieOtwarte: {
    en: 'A hole in the wall — step through',
    pl: 'Dziura w ścianie — wejdź do środka',
  },

  // Lore — szept w ciemności, zanim padną pieczęcie.
  lore: {
    en: 'The wall gives way to a room that should not fit here. A pale figure hangs in the coin-cold dark, ringed by marks that burn without fire. It has been counting since before you were born — and it knows you came.',
    pl: 'Ściana ustępuje, odsłaniając pokój, który nie powinien się tu zmieścić. Blada postać wisi w zimnym jak monety mroku, otoczona znakami, które płoną bez ognia. Liczy od czasów sprzed twoich narodzin — i wie, że przyszedłeś.',
  },

  // Ambientowe mamrotanie z ciemności — cichy, niepokojący szept w tle.
  szept1: { en: '…count them again…', pl: '…policz je jeszcze raz…' },
  szept2: { en: '…the wall remembers…', pl: '…ściana pamięta…' },
  szept3: { en: '…you were not the first…', pl: '…nie byłeś pierwszy…' },

  // ── Wyzwanie: trzy pieczęcie ──
  wyzwanieNaglowek: { en: 'Three seals guard the name.', pl: 'Trzy pieczęcie strzegą imienia.' },
  wyzwaniePodtytul: {
    en: 'Answer each to break the next.',
    pl: 'Odpowiedz na każdą, by pękła następna.',
  },
  pieczec1: { en: 'First Seal', pl: 'Pierwsza Pieczęć' },
  pieczec2: { en: 'Second Seal', pl: 'Druga Pieczęć' },
  pieczec3: { en: 'Third Seal', pl: 'Trzecia Pieczęć' },

  zagadka1: {
    en: 'Counted a thousand times, spent not once. Copper runs in my veins; gold sits where a heart should be. Name the thing I am made of.',
    pl: 'Liczony tysiąc razy, wydany ani razu. Miedź płynie w moich żyłach, złoto tkwi tam, gdzie serce. Nazwij to, z czego jestem.',
  },
  zagadka2: {
    en: 'I stand in a locked room the desperate pay to enter. Bomb my wall and I turn against you. Name the place I keep.',
    pl: 'Stoję w zamkniętym pokoju, do którego zdesperowani płacą za wstęp. Zbombarduj mój mur, a obrócę się przeciw tobie. Nazwij miejsce, którego strzegę.',
  },
  zagadka3: {
    en: 'Strip the shopkeeper away and something older answers. It wears a crown of pennies and never sleeps. Whisper its true name.',
    pl: 'Zdejmij sklepikarza, a odpowie coś starszego. Nosi koronę z groszy i nigdy nie śpi. Wyszepcz jego prawdziwe imię.',
  },

  // Podpowiedzi po złej odpowiedzi (per pieczęć) — kierują, nie zdradzają.
  blad1: {
    en: 'The mark holds. Think of what fills both its veins and its ledger.',
    pl: 'Znak trzyma. Pomyśl o tym, co wypełnia i jego żyły, i jego rachunki.',
  },
  blad2: {
    en: 'The mark holds. Where does it wait for the ones who need it most?',
    pl: 'Znak trzyma. Gdzie czeka na tych, którzy potrzebują go najbardziej?',
  },
  blad3: {
    en: 'The mark holds. When the wall falls, the shopkeeper is gone — and this stands in its place.',
    pl: 'Znak trzyma. Gdy pada ściana, sklepikarza już nie ma — a to staje na jego miejscu.',
  },

  // Po rozbiciu pojedynczej pieczęci.
  krokOtwarty: { en: 'The seal flares and breaks.', pl: 'Pieczęć rozbłyska i pęka.' },

  // Domknięcie wszystkich trzech — chwila przed nagrodą.
  finalNaglowek: {
    en: 'The three seals align.',
    pl: 'Trzy pieczęcie stają w jednym rzędzie.',
  },
  finalOpis: {
    en: 'The dark peels back. Something wakes.',
    pl: 'Ciemność się cofa. Coś się budzi.',
  },

  polePlaceholder: { en: '…whisper…', pl: '…wyszepcz…' },
  przycisk: { en: 'Whisper', pl: 'Wyszepcz' },
  // Podpis nad polem — żeby szept czuł się jak gest, nie jak zwykły formularz.
  polePodpis: { en: 'Speak into the dark', pl: 'Powiedz to w ciemność' },
  // Etykieta paska pieczęci dla czytników ekranu.
  postepAria: { en: 'Seals broken', pl: 'Rozbite pieczęcie' },

  // Po zdobyciu (świeżo, ?ok=1).
  sukcesNaglowek: { en: 'It looks up.', pl: 'Podnosi wzrok.' },
  sukcesOpis: {
    en: 'With the three seals gone, the Shopkeeper meets your eyes, drops a single coin into your palm and nods. Under the counter it was always the Keeper. You were the kind who looks where nobody does.',
    pl: 'Gdy trzy pieczęcie znikają, Shopkeeper patrzy ci w oczy, wrzuca w dłoń jedną monetę i kiwa głową. Pod kontuarem zawsze był Keeperem. Byłeś z tych, co szukają tam, gdzie nikt.',
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
    en: 'This room already gave up its secret to you. The marks still burn, low and patient.',
    pl: 'Ten pokój już wydał ci swój sekret. Znaki wciąż płoną — cicho i cierpliwie.',
  },

  // Gość — nie ma komu nadać tytułu.
  goscNaglowek: { en: 'You are barely here.', pl: 'Ledwie tu jesteś.' },
  goscOpis: {
    en: 'Secrets need someone to keep them. Sign in and the room will notice you.',
    pl: 'Sekrety potrzebują kogoś, kto je zachowa. Zaloguj się, a pokój cię zauważy.',
  },

  wroc: { en: 'Back out of the wall', pl: 'Wyjdź ze ściany' },
} satisfies Przestrzen
