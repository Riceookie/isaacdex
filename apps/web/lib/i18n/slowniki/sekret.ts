import type { Przestrzen } from '../typy'

/**
 * Sekretny Pokój — ukryty ekran w klimacie „secret room" z gry (te za zbombardowaną ścianą).
 * Wejście jest zataczone (mały Keeper na górnym pasku, rysa na dole sidebara), a w środku
 * za kontuarem stoi Shopkeeper (ta przeszkoda-sklepikarz z Shopa, nie grywalny Keeper) i
 * zadaje zagadkę. Sęk w tym, że gdy zbombardujesz Shopkeepera, ten zmienia się w Keepera —
 * i to jest odpowiedź. Poprawne imię nadaje tytuł „Keeper". Nazwy własne (Keeper, Shopkeeper,
 * Secret Room) zostają po angielsku — to żargon z gry — reszta jest tłumaczona.
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

  // Lore — szept w ciemności, zanim padnie zagadka.
  lore: {
    en: 'The wall gives way to a coin-lit room. Behind a low counter a pale figure keeps a shop for no one, sorting coins it will never spend. It does not look up.',
    pl: 'Ściana ustępuje, odsłaniając pokój w blasku monet. Za niskim kontuarem blada postać prowadzi sklep dla nikogo i przekłada monety, których nigdy nie wyda. Nie podnosi wzroku.',
  },

  // Ambientowe mamrotanie zza kontuaru — cichy szept, który przewija się w tle.
  szept1: { en: '…everything has a price…', pl: '…wszystko ma swoją cenę…' },
  szept2: { en: '…no refunds…', pl: '…bez zwrotów…' },
  szept3: { en: '…count it again…', pl: '…przelicz jeszcze raz…' },

  // Sekretny towar na cokole — nie da się rozpoznać, co to.
  ofertaTip: {
    en: 'Something is for sale here. You cannot make out what.',
    pl: 'Coś jest tu na sprzedaż. Nie sposób rozpoznać, co.',
  },
  cena: { en: '??¢', pl: '??¢' },

  zagadkaNaglowek: {
    en: 'A dry voice, without looking up:',
    pl: 'Suchy głos, nie podnosząc wzroku:',
  },
  zagadka: {
    en: 'Copper is my blood and gold is my heart, yet I spend neither. I keep a shop I will never rob and hand back change to no one. Lay a charge against my counter — the shell breaks, not the wall, and what steps out of it is me. Whisper the name I wear when I fall.',
    pl: 'Miedź to moja krew, a złoto to serce — lecz nie wydaję żadnego. Pilnuję sklepu, którego nigdy nie okradnę, i nikomu nie daję reszty. Podłóż ładunek pod mój kontuar — pęka skorupa, nie ściana, a to, co z niej wychodzi, to ja. Wyszepcz imię, które noszę, gdy upadam.',
  },
  polePlaceholder: { en: '…whisper a name…', pl: '…wyszepcz imię…' },
  przycisk: { en: 'Whisper', pl: 'Wyszepcz' },
  // Podpowiedź nad polem — żeby szept czuł się jak gest, nie jak zwykły formularz.
  polePodpis: { en: 'Speak into the dark', pl: 'Powiedz to w ciemność' },

  zlaOdpowiedz: {
    en: 'The figure shakes its head and keeps counting. A coin clinks somewhere in the dark. Look at what it is made of — and what it becomes when the wall comes down.',
    pl: 'Postać kręci głową i liczy dalej. Gdzieś w ciemności brzęka moneta. Spójrz, z czego jest zrobiona — i czym się staje, gdy pada ściana.',
  },

  // Po zdobyciu.
  sukcesNaglowek: { en: 'It looks up.', pl: 'Podnosi wzrok.' },
  sukcesOpis: {
    en: 'The Shopkeeper meets your eyes, drops a single coin into your palm and nods. Under the counter it was always the Keeper. You were the kind who looks where nobody does.',
    pl: 'Shopkeeper patrzy ci w oczy, wrzuca w dłoń jedną monetę i kiwa głową. Pod kontuarem zawsze był Keeperem. Byłeś z tych, co szukają tam, gdzie nikt.',
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
