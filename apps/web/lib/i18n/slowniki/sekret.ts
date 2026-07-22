import type { Przestrzen } from '../typy'

/**
 * Sekretny Pokój — ukryty ekran w klimacie „secret room" z gry (te za zbombardowaną ścianą).
 * Wejście jest zataczone (mały Keeper na górnym pasku, rysa na dole sidebara). W środku jest
 * ciemny, arkaniczny pokój, w którym w mroku wisi Shopkeeper (przeszkoda-sklepikarz z Shopa,
 * nie grywalny Keeper), otoczony kręgiem run. Sekret otwiera rytuał z PIĘCIU kroków:
 *   zagadka 1 → mini-gra „Łapanie Monet" → zagadka 2 → mini-gra „Waga Chciwości" → zagadka 3.
 * Trzy zagadki tekstowe (monety → chciwość → Keeper) sprawdza serwer; rozwiązanie ostatniej
 * nadaje tytuł „Keeper". Nazwy własne (Keeper, Shopkeeper, Greed, Secret Room) zostają po
 * angielsku — to żargon z gry — reszta jest tłumaczona.
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

  // Lore — szept w ciemności, zanim zacznie się rytuał.
  lore: {
    en: 'The wall gives way to a room that should not fit here. A pale figure hangs in the coin-cold dark, ringed by marks that burn without fire. It has been counting since before you were born — and it knows you came.',
    pl: 'Ściana ustępuje, odsłaniając pokój, który nie powinien się tu zmieścić. Blada postać wisi w zimnym jak monety mroku, otoczona znakami, które płoną bez ognia. Liczy od czasów sprzed twoich narodzin — i wie, że przyszedłeś.',
  },

  // Ambientowe mamrotanie z ciemności — cichy, niepokojący szept w tle.
  szept1: { en: '…count them again…', pl: '…policz je jeszcze raz…' },
  szept2: { en: '…the wall remembers…', pl: '…ściana pamięta…' },
  szept3: { en: '…you were not the first…', pl: '…nie byłeś pierwszy…' },

  // ── Rytuał: trzy zagadki, dwie próby ──
  wyzwanieNaglowek: { en: 'Three seals, two trials.', pl: 'Trzy pieczęcie, dwie próby.' },
  wyzwaniePodtytul: {
    en: 'Answer, catch and weigh your way to the name.',
    pl: 'Odpowiadaj, łap i waż, aż dojdziesz do imienia.',
  },

  zagadka1: {
    en: 'When the shopkeeper bleeds, this is what falls — copper for pennies, never for free. Catch it before the floor drinks it. Name what rains down.',
    pl: 'Gdy sklepikarz krwawi, to właśnie spada — miedź za grosze i nigdy za darmo. Złap to, zanim wypije je podłoga. Nazwij to, co pada z góry.',
  },
  zagadka2: {
    en: 'A machine in the deep weighs your want against your worth and swallows the greedy whole. Name the sin it runs on.',
    pl: 'Maszyna w głębi waży twoje żądze przeciw twojej kieszeni i połyka chciwych w całości. Nazwij grzech, na którym chodzi.',
  },
  zagadka3: {
    en: 'Coin-blooded, shop-bound, older than the counter it hides behind. When the wall falls, it wakes. Whisper its name.',
    pl: 'Krew z monet, przykuty do sklepu, starszy niż kontuar, za którym się chowa. Gdy pada ściana — budzi się. Wyszepcz jego imię.',
  },

  // Podpowiedzi po złej odpowiedzi (per zagadka) — kierują, nie zdradzają.
  blad1: {
    en: 'The mark holds. Think of what fills both its veins and its ledger.',
    pl: 'Znak trzyma. Pomyśl o tym, co wypełnia i jego żyły, i jego rachunki.',
  },
  blad2: {
    en: 'The mark holds. It is the sin of wanting more than you can pay for.',
    pl: 'Znak trzyma. To grzech pragnienia więcej, niż stać cię zapłacić.',
  },
  blad3: {
    en: 'The mark holds. When the wall falls, the shopkeeper is gone — and this stands in its place.',
    pl: 'Znak trzyma. Gdy pada ściana, sklepikarza już nie ma — a to staje na jego miejscu.',
  },

  // Po rozbiciu pojedynczego kroku.
  krokOtwarty: { en: 'The seal flares and breaks.', pl: 'Pieczęć rozbłyska i pęka.' },

  // ── Mini-gra 1: Łapanie Monet ──
  gra1Tytul: { en: 'Coin Catching', pl: 'Łapanie Monet' },
  gra1Opis: {
    en: 'Slide the shopkeeper to catch the falling coins.',
    pl: 'Przesuwaj sklepikarza i łap spadające monety.',
  },
  gra1Cel: { en: 'Caught', pl: 'Złapane' },
  gra1Win: { en: 'The coins are yours.', pl: 'Monety są twoje.' },

  // ── Mini-gra 2: Waga Chciwości ──
  gra2Tytul: { en: "Greed's Scale", pl: 'Waga Chciwości' },
  gra2Opis: {
    en: 'Drag coins onto the pan until they balance the price.',
    pl: 'Przeciągaj monety na szalę, aż zrównoważą cenę.',
  },
  gra2Cena: { en: 'Price', pl: 'Cena' },
  gra2Twoje: { en: 'Paid', pl: 'Wpłacone' },
  gra2Malo: { en: 'Too light — add more.', pl: 'Za lekko — dołóż.' },
  gra2Duzo: { en: 'Too greedy — take some back.', pl: 'Za chciwie — zabierz trochę.' },
  gra2Rowno: { en: 'Balanced.', pl: 'Równo.' },
  gra2Win: { en: 'The scale rests. Greed is satisfied.', pl: 'Waga spoczywa. Chciwość nasycona.' },
  gra2Cofnij: {
    en: '(tap a coin on the pan to take it back)',
    pl: '(dotknij monety na szali, by ją zabrać)',
  },

  // ── Mini-gra 3: Uderz Kreta (Whac-a-Mole) ──
  gra3Tytul: { en: 'Whac-a-Mole', pl: 'Uderz Kreta' },
  gra3Opis: {
    en: 'Whack the moles as they pop out — before time runs out.',
    pl: 'Uderzaj krety, gdy wyskakują — zanim skończy się czas.',
  },
  gra3Licznik: { en: 'Whacked', pl: 'Ubite' },
  gra3Czas: { en: 'Time', pl: 'Czas' },
  gra3Zawal: { en: 'Too slow! Again.', pl: 'Za wolno! Jeszcze raz.' },
  gra3Win: { en: 'Every last one, squashed.', pl: 'Co do jednego — rozgniecione.' },

  // ── Mini-gra 4: Ruletka Pigułek (Pill Roulette) ──
  gra4Tytul: { en: 'Pill Roulette', pl: 'Ruletka Pigułek' },
  gra4Opis: {
    en: 'Swallow a pill. Get three good ones in a row.',
    pl: 'Połknij pigułkę. Trafić trzy dobre z rzędu.',
  },
  gra4Dobra: { en: 'A good one!', pl: 'Dobra!' },
  gra4Zla: { en: 'Bad trip — streak reset.', pl: 'Zły odlot — seria zerowana.' },
  gra4Win: { en: 'Three good pills. Steady stomach.', pl: 'Trzy dobre. Mocny żołądek.' },

  // ── Mini-gra 5: Unik przed Fetusem (Fetus Dodge) ──
  gra5Tytul: { en: 'Fetus Dodge', pl: 'Unik przed Fetusem' },
  gra5Opis: {
    en: 'Switch lanes to dodge the homing missiles.',
    pl: 'Zmieniaj pas i uciekaj przed naprowadzanymi rakietami.',
  },
  gra5Licznik: { en: 'Dodged', pl: 'Uniki' },
  gra5Oberwane: { en: 'Hit! Shake it off.', pl: 'Oberwane! Otrząśnij się.' },
  gra5Reset: { en: 'Down you go — start again.', pl: 'Padłeś — od nowa.' },
  gra5Win: { en: 'You outran the fetus.', pl: 'Uciekłeś fetusowi.' },

  // ── Mini-gra 6: Ładowanie Baterii (Battery Charge) ──
  gra6Tytul: { en: 'Battery Charge', pl: 'Ładowanie Baterii' },
  gra6Opis: {
    en: 'Tap fast to charge the battery before the dark takes the room.',
    pl: 'Stukaj szybko i naładuj baterię, zanim ciemność pochłonie pokój.',
  },
  gra6Stukaj: { en: 'TAP', pl: 'STUKAJ' },
  gra6Ciemnosc: { en: 'The dark is winning — tap!', pl: 'Ciemność wygrywa — stukaj!' },
  gra6Zgaslo: { en: 'It went dark. Again.', pl: 'Zgasło. Jeszcze raz.' },
  gra6Win: { en: 'Fully charged. The room holds.', pl: 'Naładowana. Pokój trzyma się światła.' },

  // Domknięcie rytuału — chwila przed nagrodą.
  finalNaglowek: { en: 'The three seals align.', pl: 'Trzy pieczęcie stają w jednym rzędzie.' },
  finalOpis: {
    en: 'The dark peels back. Something wakes.',
    pl: 'Ciemność się cofa. Coś się budzi.',
  },

  polePlaceholder: { en: '…whisper…', pl: '…wyszepcz…' },
  przycisk: { en: 'Whisper', pl: 'Wyszepcz' },
  // Podpis nad polem — żeby szept czuł się jak gest, nie jak zwykły formularz.
  polePodpis: { en: 'Speak into the dark', pl: 'Powiedz to w ciemność' },
  // Etykieta paska postępu dla czytników ekranu.
  postepAria: { en: 'Ritual progress', pl: 'Postęp rytuału' },

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
