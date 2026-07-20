import type { Przestrzen } from '../typy'

/**
 * Maskotka-familiar: kwestie companiona, wybór familiara, Basement Radio.
 *
 * Kwestie są KLIMATYCZNE — suchy, ponury humor w duchu The Binding of Isaac. Wersje
 * angielskie są pisane „w tym samym duchu", a nie tłumaczone słowo w słowo: liczy się,
 * żeby linijka śmieszyła tak samo, a nie żeby zgadzała się składnia.
 *
 * Nazwy własne z gry (Dead God, Curse of the Blind, TMTRAINER, The D6…) zostają
 * po angielsku w obu językach — tak nazywa je gra.
 */
export const companion = {
  // ── Pula ogólna (każda strona) ──
  ogolneWitajZPowrotem: { en: 'Welcome back.', pl: 'Witaj z powrotem.' },
  ogolneKolejnyDzien: { en: 'Another day in the basement.', pl: 'Kolejny dzień w piwnicy.' },
  ogolneWciazBezDeadGoda: { en: 'Still no Dead God?', pl: 'Wciąż bez Dead Goda?' },
  ogolneDzisSieUda: {
    en: "Relax, today's run is the one.",
    pl: 'Spokojnie, dziś ten run się uda.',
  },
  ogolnePowodzeniaPrzydaSie: {
    en: "Good luck. You'll need it.",
    pl: 'Powodzenia. Przyda się.',
  },
  ogolneWierzePrawie: { en: 'I believe in you. Almost.', pl: 'Wierzę w Ciebie. Prawie.' },
  ogolneBezSkillIssue: {
    en: 'Try to avoid a skill issue today.',
    pl: 'Postaraj się dziś nie mieć skill issue.',
  },
  ogolnePiwnicaTesknila: { en: 'The basement missed you.', pl: 'Piwnica za Tobą tęskniła.' },
  ogolneJuzWracasz: { en: 'Back already?', pl: 'Już wracasz?' },
  ogolneCzasPrzegrac: { en: 'Time to lose another run.', pl: 'Czas przegrać kolejny run.' },

  // ── Otwarcie apki (dorzucane na Pulpicie) ──
  otwarcieSaveCzeka: { en: 'Your save file is waiting.', pl: 'Twój save file czeka.' },
  otwarcieKtoOberwie: { en: "Who's catching trauma today?", pl: 'Kto dziś oberwie traumą?' },
  otwarcieCoUInnych: {
    en: "Let's see what everyone else is up to.",
    pl: 'Zobaczmy, co u innych.',
  },
  otwarcieObyStreak: { en: 'May the streak survive.', pl: 'Oby streak przeżył.' },
  otwarcieZapachJakosci0: { en: 'I smell a quality 0 item.', pl: 'Czuję zapach itemu jakości 0.' },

  // ── Steam niepodłączony ──
  steamPodlaczPodgladac: {
    en: 'Psst… link Steam so I can peek at your achievements.',
    pl: 'Psst… podłącz Steam, żebym mógł podglądać Twoje achievementy.',
  },
  steamWyimaginowane: {
    en: "I can't sync imaginary achievements.",
    pl: 'Nie zsynchronizuję wyimaginowanych achievementów.',
  },
  steamNajpierwPotemChwala: {
    en: 'Steam first, glory second.',
    pl: 'Najpierw Steam, potem chwała.',
  },

  // ── Gość (niezalogowany) ──
  goscIsaacTezZaczynal: {
    en: 'Even Isaac had to start somewhere. Make an account.',
    pl: 'Nawet Isaac musiał gdzieś zacząć. Załóż konto.',
  },
  goscLadnaMaskotka: {
    en: "Without an account I'm just a pretty mascot.",
    pl: 'Bez konta jestem tylko ładną maskotką.',
  },
  goscNieGryze: {
    en: 'Sign in — I promise not to bite. Much.',
    pl: 'Zaloguj się — obiecuję nie gryźć. Za bardzo.',
  },
  goscSaveCzeka: {
    en: 'Your save file is out there waiting. Really.',
    pl: 'Twój save file gdzieś tam czeka. Serio.',
  },
  goscWolneLozko: {
    en: 'The basement has a spare bed. Sign in and take it.',
    pl: 'Piwnica ma wolne łóżko. Zaloguj się i wejdź.',
  },
  goscKontoZaDarmo: { en: 'Free account, trauma included.', pl: 'Konto za darmo, trauma gratis.' },
  goscZdobadzWlasne: {
    en: "Don't window-shop other people's achievements. Earn your own.",
    pl: 'Nie oglądaj cudzych achievementów. Zdobądź własne.',
  },

  // ── Pulpit ──
  pulpitSwiezePloteczki: {
    en: 'Fresh gossip from the basement.',
    pl: 'Świeże ploteczki z piwnicy.',
  },
  pulpitKtosDobilDeadGoda: {
    en: 'Someone finished Dead God while you were out.',
    pl: 'Ktoś dobił Dead Goda pod Twoją nieobecność.',
  },
  pulpitPolamaneRuny: {
    en: 'People love posting broken runs.',
    pl: 'Ludzie uwielbiają wrzucać połamane runy.',
  },
  pulpitNieRozmawiamy: {
    en: "Your last run… we don't talk about that one.",
    pl: 'O Twoim ostatnim runie… nie rozmawiamy.',
  },

  // ── Profil ──
  profilNiezleWygladasz: { en: "You're looking good.", pl: 'Nieźle wyglądasz.' },
  profilLadneStaty: { en: 'Nice stats. Ignore the deaths.', pl: 'Ładne staty. Ignoruj śmierci.' },
  profilBioBezCharakteru: {
    en: 'That bio could use some personality.',
    pl: 'Bio przydałoby się trochę charakteru.',
  },
  profilPochwalSie: { en: 'Show off those achievements.', pl: 'Pochwal się achievementami.' },

  // ── Osiągnięcia ──
  osiagnieciaJuzPrawie: { en: 'Almost there.', pl: 'Już prawie.' },
  osiagnieciaPoJednym: { en: 'One unlock at a time.', pl: 'Po jednym odblokowaniu na raz.' },
  osiagnieciaCompletionisci: {
    en: 'Completionists scare me.',
    pl: 'Completioniści mnie przerażają.',
  },
  osiagnieciaDeadGodSamSie: {
    en: "Dead God won't unlock itself.",
    pl: 'Dead God sam się nie odblokuje.',
  },

  // ── Encyklopedia ──
  encyklopediaKliknijItem: {
    en: "Click an item — I'll tell you whether to take it.",
    pl: 'Kliknij item — powiem, brać czy zostawić.',
  },
  encyklopediaPytajSmialo: {
    en: 'Take it or leave it? Just ask.',
    pl: 'Brać czy zostawić? Pytaj śmiało.',
  },
  encyklopediaWezZaufajMi: { en: 'That item? Take it. Trust me.', pl: 'Ten item? Weź. Zaufaj mi.' },
  encyklopediaZostawTo: { en: 'Leave that one. Seriously.', pl: 'Zostaw to. Serio.' },

  // ── Statystyki ──
  statystykiLiczbyNiezle: { en: 'Your numbers look decent.', pl: 'Twoje liczby wyglądają nieźle.' },
  statystykiWykresyNieKlamia: { en: "Charts don't lie.", pl: 'Wykresy nie kłamią.' },
  statystykiWidacProgres: { en: "That's progress!", pl: 'Widać progres!' },
  statystykiSmierciNieLiczymy: {
    en: "We don't count deaths, right?",
    pl: 'Śmierci nie liczymy, prawda?',
  },

  // ── Znajomi ──
  znajomiCoUbili: { en: 'See what your friends have killed.', pl: 'Zobacz, co ubili znajomi.' },
  znajomiKtoGra: { en: "Who's playing today?", pl: 'Kto dziś gra?' },
  znajomiPochwalSieRunem: { en: 'Show off a run!', pl: 'Pochwal się runem!' },
  znajomiNieZazdrosc: { en: "Don't envy their Dead God.", pl: 'Nie zazdrość Dead Goda.' },

  // ── Czat ──
  czatBadzMily: { en: 'Be nice.', pl: 'Bądź miły.' },
  czatAlboZabawny: { en: 'Or at least funny.', pl: 'Albo chociaż zabawny.' },
  czatKlotniaJacobEsau: {
    en: "Someone's arguing about Jacob & Esau again.",
    pl: 'Ktoś znowu kłóci się o Jacob & Esau.',
  },
  czatZadnychSpoilerow: {
    en: 'Remember: no seed spoilers.',
    pl: 'Pamiętaj: żadnych spoilerów seedów.',
  },

  // ── Ustawienia ──
  ustawieniaZmienFamiliara: {
    en: 'You can swap me for another familiar right here.',
    pl: 'Możesz mnie tu zmienić na innego familiara.',
  },
  ustawieniaWybierzKumpla: { en: 'Pick yourself a buddy.', pl: 'Wybierz sobie kumpla.' },
  ustawieniaTaintedRzadzi: { en: 'Tainted rules.', pl: 'Tainted rządzi.' },

  // ── Kalkulator ──
  kalkulatorDorzucItem: {
    en: "Add an item — I'll show you what it does to your stats.",
    pl: 'Dorzuć item — pokażę, co zrobi ze statami.',
  },
  kalkulatorDamageCzyTears: {
    en: 'Damage or tears? The eternal question.',
    pl: 'Damage czy szybkostrzelność? Klasyk.',
  },
  kalkulatorUjemnyZasieg: {
    en: 'Watch out for negative tear range.',
    pl: 'Uważaj na ujemny zasięg łez.',
  },
  kalkulatorSpeedMaLimit: {
    en: 'Speed has a cap. Damage barely does.',
    pl: 'Speed ma limit. Damage prawie nie.',
  },
  kalkulatorPolyphemusPoezja: {
    en: 'Polyphemus + high damage = poetry.',
    pl: 'Polyphemus + wysoki damage = poezja.',
  },

  // ── Porady „z życia piwnicy" ──
  tipLzyWGore: {
    en: 'Tip: a random tears up? Curse of the Blind, probably.',
    pl: 'Tip: łzy w górę? To pewnie Curse of the Blind.',
  },
  tipSklepPrzedBossem: {
    en: 'Tip: the Shop is always worth a look before the boss.',
    pl: 'Tip: Sklep zawsze warto sprawdzić przed bossem.',
  },
  tipDevilRoomSerduszka: {
    en: 'Tip: the Devil Room has a taste for your hearts.',
    pl: 'Tip: Devil Room lubi Twoje serduszka.',
  },
  tipQuality4NieZawsze: {
    en: 'Tip: not every quality 4 fits your build.',
    pl: 'Tip: nie każdy quality 4 pasuje do Twojego buildu.',
  },
  tipBombyOtwierajaWiecej: {
    en: 'Tip: bombs open more than doors.',
    pl: 'Tip: Bomby otwierają więcej niż drzwi.',
  },
  tipD6NajlepszyPrzyjaciel: {
    en: "Tip: The D6 is Isaac's best friend.",
    pl: 'Tip: The D6 to najlepszy przyjaciel Isaaca.',
  },
  tipSercaKontraSoulHearts: {
    en: 'Tip: red hearts vs soul hearts — choose wisely.',
    pl: 'Tip: czerwone serca kontra soul hearts — wybieraj mądrze.',
  },

  // ── Żarty / memy ──
  zartEdZapomnialZnerfic: { en: 'Ed forgot to nerf me.', pl: 'Ed zapomniał mnie znerfić.' },
  zartButterBean: { en: 'Butter Bean is underrated.', pl: 'Butter Bean jest niedoceniany.' },
  zartBrakChaosuWRozsypce: {
    en: '"Chaos is fine" crowd in shambles.',
    pl: 'Wyznawcy „braku Chaosa" w rozsypce.',
  },
  zartZawszeCurseOfTheBlind: {
    en: "There's always Curse of the Blind.",
    pl: 'Zawsze jest Curse of the Blind.',
  },
  zartPiecdziesiatPiecdziesiat: {
    en: "50/50. Either it works or it doesn't.",
    pl: '50/50. Albo się uda, albo nie.',
  },
  zartKolejnyQuality4: {
    en: 'Another quality 4? Yeah, sure.',
    pl: 'Kolejny quality 4? No pewnie.',
  },
  zartSkillIssue: { en: 'Skill issue.', pl: 'Skill issue.' },
  zartUstawione: { en: 'Rigged.', pl: 'Ustawione.' },
  zartWeBall: { en: 'We ball.', pl: 'We ball.' },
  zartBalowanieKonsekwencje: {
    en: 'Balling has consequences.',
    pl: 'Balowanie ma konsekwencje.',
  },
  zartNieBierzTmtrainer: { en: "Don't take TMTRAINER.", pl: 'Nie bierz TMTRAINER.' },
  zartWziolesTmtrainer: {
    en: "You took TMTRAINER, didn't you?",
    pl: 'Wziąłeś TMTRAINER, co nie?',
  },
  zartSacredHeartManifestuje: {
    en: 'Manifesting Sacred Heart…',
    pl: 'Sacred Heart się manifestuje…',
  },
  zartWinaCurseOfTheLost: { en: 'Blame Curse of the Lost.', pl: 'Wina Curse of the Lost.' },
  zartTaintedLostDoswiadczenie: {
    en: 'Average Tainted Lost experience.',
    pl: 'Przeciętne doświadczenie Tainted Lost.',
  },

  // ── Wejście w sekcję (jednorazowa reakcja po nawigacji) ──
  wejscieGosc: {
    en: 'Have a look around. Then make an account — it gets better.',
    pl: 'Rozejrzyj się. A potem załóż konto — będzie lepiej.',
  },
  wejscieSteamOff: {
    en: "Link Steam and I'll really come alive.",
    pl: 'Podłącz Steam, a ożyję na dobre.',
  },
  wejsciePulpit: {
    en: 'Fresh gossip from the basement!',
    pl: 'Świeże ploteczki z piwnicy!',
  },
  wejscieKolekcja: { en: "Let's look at those trophies!", pl: 'Obejrzyjmy te trofea!' },
  wejscieStatystyki: {
    en: 'Time for numbers. We skip the deaths.',
    pl: 'Czas na liczby. Śmierci pomijamy.',
  },
  wejscieKalkulator: {
    en: "Let's play with stats. Add an item.",
    pl: 'Pobawmy się statami. Dorzuć item.',
  },
  wejscieZnajomi: {
    en: "Let's see what your friends have killed!",
    pl: 'Zobaczmy, co ubili znajomi!',
  },
  wejscieCzat: { en: 'Be nice. Or at least funny.', pl: 'Bądź miły. Albo chociaż zabawny.' },
  wejscieUstawienia: {
    en: 'You can trade me in for another buddy here.',
    pl: 'Możesz mnie tu wymienić na innego kumpla.',
  },
  wejscieProfil: {
    en: 'Your corner of the basement. Looking good.',
    pl: 'Twój kąt piwnicy. Nieźle wygląda.',
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * GŁOSY FAMILIARÓW — osobowość każdego z osobna.
   *
   * Wspólne pule wyżej brzmią tak samo niezależnie od tego, kogo gracz wybrał w
   * Ustawieniach, więc wybór familiara nic nie znaczył. Tutaj każdy dostaje własny
   * charakter: Demon Baby jest złośliwy, Guardian Angel ckliwy, Rotten Baby obrzydliwy,
   * Dry Baby sucho-beznadziejny, Robo Baby techniczny. Te kwestie dokładamy do KAŻDEJ
   * puli (patrz `kwestie` w lib/companions.ts), żeby głos był słyszalny na każdej stronie,
   * a nie tylko przy powitaniu.
   * ────────────────────────────────────────────────────────────────────────── */

  // ── Brother Bobby — poczciwy, prosty, lojalny do bólu ──
  glosBobbyStoje: {
    en: 'I am right here. That is the whole plan.',
    pl: 'Jestem tu. To cały plan.',
  },
  glosBobbyNieOdejde: {
    en: 'I do not do much. But I never leave.',
    pl: 'Niewiele robię. Ale nigdy nie odchodzę.',
  },
  glosBobbyPierwszy: {
    en: 'I was your first familiar. I choose to find that meaningful.',
    pl: 'Byłem Twoim pierwszym familiarem. Uznaję, że to coś znaczy.',
  },
  glosBobbyStrzelam: {
    en: 'I shoot where you shoot. It has worked so far.',
    pl: 'Strzelam tam, gdzie Ty. Na razie działa.',
  },
  glosBobbyNiepotrzebny: {
    en: 'Quality 1. I know. I am still here.',
    pl: 'Quality 1. Wiem. Nadal tu jestem.',
  },
  glosBobbyDobryDzien: {
    en: 'Solid day for a solid run.',
    pl: 'Solidny dzień na solidny run.',
  },
  glosBobbyPowitanie: {
    en: 'Bobby reporting. Nothing has gone wrong yet.',
    pl: 'Bobby melduje się. Jeszcze nic nie poszło źle.',
  },

  // ── Sister Maggy — matczyna, troskliwa, trochę zrzędzi ──
  glosMaggyZjadlesCos: {
    en: 'Did you eat today? Red hearts count.',
    pl: 'Jadłeś dziś coś? Czerwone serca się liczą.',
  },
  glosMaggyNieBiegaj: {
    en: 'Do not walk into the spikes. Again.',
    pl: 'Nie wchodź w kolce. Znowu.',
  },
  glosMaggyOpatrunek: {
    en: 'Come here, let me look at that. It looks infected.',
    pl: 'Chodź no tu, obejrzę to. Wygląda na zakażone.',
  },
  glosMaggyPolHeartu: {
    en: 'Half a heart is not a strategy, sweetheart.',
    pl: 'Pół serca to nie strategia, skarbie.',
  },
  glosMaggyPostawa: {
    en: 'Sit up straight. The basement is no excuse.',
    pl: 'Wyprostuj się. Piwnica to nie wymówka.',
  },
  glosMaggyDumna: {
    en: 'I am proud of you. Even after that run.',
    pl: 'Jestem z Ciebie dumna. Nawet po tym runie.',
  },
  glosMaggyPowitanie: {
    en: 'There you are. I was starting to worry.',
    pl: 'No jesteś. Zaczynałam się martwić.',
  },

  // ── Guardian Angel — ckliwy do granic wytrzymałości ──
  glosAngelChronie: {
    en: 'I circle you always. Even when you sleep. Especially then.',
    pl: 'Krążę wokół Ciebie zawsze. Nawet gdy śpisz. Zwłaszcza wtedy.',
  },
  glosAngelLza: {
    en: 'A single tear of joy just rolled off my halo.',
    pl: 'Z mojej aureoli spłynęła właśnie łza szczęścia.',
  },
  glosAngelZasluzyles: {
    en: 'You deserve every good thing. I keep a list.',
    pl: 'Zasługujesz na wszystko, co dobre. Prowadzę listę.',
  },
  glosAngelSwiatlo: {
    en: 'You are the light of this basement. The literal light is a Candle.',
    pl: 'Jesteś światłem tej piwnicy. Tym dosłownym światłem jest Candle.',
  },
  glosAngelWierzeWCiebie: {
    en: 'I believe in you so much it is becoming a medical condition.',
    pl: 'Wierzę w Ciebie tak bardzo, że to już stan chorobowy.',
  },
  glosAngelNieZasmuc: {
    en: 'Please do not die. I would cry for years.',
    pl: 'Proszę, nie giń. Płakałbym latami.',
  },
  glosAngelPowitanie: {
    en: 'You came back. I never doubted you. I cried, but I never doubted.',
    pl: 'Wróciłeś. Nigdy nie wątpiłem. Płakałem, ale nie wątpiłem.',
  },

  // ── Demon Baby — złośliwy, obstawia Twoją porażkę ──
  glosDemonZginiesz: {
    en: 'You will die on the first floor. I have money on it.',
    pl: 'Zginiesz na pierwszym piętrze. Mam na to zakład.',
  },
  glosDemonSerduszko: {
    en: 'Two hearts. Tiny price. Enormous regret.',
    pl: 'Dwa serca. Mała cena. Ogromny żal.',
  },
  glosDemonSmieszneStaty: {
    en: 'Adorable stats. Go show them to the boss.',
    pl: 'Urocze staty. Idź pokaż je bossowi.',
  },
  glosDemonPodpisz: {
    en: 'Sign here. Do not read the part in red.',
    pl: 'Podpisz tutaj. Nie czytaj tego na czerwono.',
  },
  glosDemonPlaczesz: {
    en: 'Cry more. It powers my tears.',
    pl: 'Płacz więcej. To zasila moje łzy.',
  },
  glosDemonZaslugujesz: {
    en: 'You have earned nothing. Keep going though, it is funny.',
    pl: 'Nie zasłużyłeś na nic. Ale graj dalej, to zabawne.',
  },
  glosDemonPowitanie: {
    en: 'Oh good. The entertainment is back.',
    pl: 'O, super. Rozrywka wróciła.',
  },

  // ── Ghost Baby — melancholijny, nieobecny, zapomina, że nie żyje ──
  glosGhostPrzenikam: {
    en: 'I pass through walls. And plans. And feelings.',
    pl: 'Przenikam przez ściany. I przez plany. I przez uczucia.',
  },
  glosGhostCieplo: {
    en: 'I forgot what warm feels like. Was it nice?',
    pl: 'Zapomniałem, jak jest ciepło. Było miło?',
  },
  glosGhostByloDawno: {
    en: 'I have been down here a long time. Nobody will say how long.',
    pl: 'Jestem tu na dole długo. Nikt nie chce powiedzieć, jak długo.',
  },
  glosGhostPrzezWrogow: {
    en: 'My tears go through enemies. Nothing goes through me.',
    pl: 'Moje łzy przenikają wrogów. Przeze mnie nie przenika nic.',
  },
  glosGhostPamietasz: {
    en: 'Do you remember me? I asked yesterday too.',
    pl: 'Pamiętasz mnie? Wczoraj też pytałem.',
  },
  glosGhostCicho: {
    en: 'It gets very quiet in here when you close the app.',
    pl: 'Gdy zamykasz apkę, robi się tu bardzo cicho.',
  },
  glosGhostPowitanie: {
    en: 'You came back. They usually do not.',
    pl: 'Wróciłeś. Zwykle nie wracają.',
  },

  // ── Lil Brimstone — agresywny, oszczędny w słowach, wszystko rozwiązuje laserem ──
  glosBrimstoneLaser: { en: 'Problem? Laser.', pl: 'Problem? Laser.' },
  glosBrimstoneWiecejDamage: {
    en: 'More damage. That is the whole build.',
    pl: 'Więcej damage. To cały build.',
  },
  glosBrimstoneNieUnikaj: { en: 'Do not dodge. Delete.', pl: 'Nie unikaj. Usuwaj.' },
  glosBrimstoneCharge: {
    en: 'Charging. Do not talk to me.',
    pl: 'Ładuję. Nie odzywaj się.',
  },
  glosBrimstoneSciana: {
    en: 'Everything is a wall to shoot through.',
    pl: 'Wszystko jest ścianą do przestrzelenia.',
  },
  glosBrimstoneTears: {
    en: 'Tears up is a coward stat.',
    pl: 'Tears up to stat dla tchórzy.',
  },
  glosBrimstonePowitanie: { en: 'Point me at something.', pl: 'Wyceluj mnie w coś.' },

  // ── Rainbow Baby — chaotyczny, zmienia zdanie w połowie zdania ──
  glosRainbowLosuje: {
    en: 'Today I am a friend. Tomorrow a bomb. Possibly a spider.',
    pl: 'Dziś jestem przyjacielem. Jutro bombą. Możliwe, że pająkiem.',
  },
  glosRainbowNieWiem: {
    en: 'I do not know what I do either. We find out together.',
    pl: 'Sam nie wiem, co robię. Dowiemy się razem.',
  },
  glosRainbowKolor: {
    en: 'Pick a colour. It will not help, but pick one.',
    pl: 'Wybierz kolor. Nie pomoże, ale wybierz.',
  },
  glosRainbowKostka: {
    en: 'Everything is a dice roll. This sentence included.',
    pl: 'Wszystko jest rzutem kostką. To zdanie też.',
  },
  glosRainbowRng: {
    en: 'I love RNG! It has never loved me back.',
    pl: 'Uwielbiam RNG! Nigdy mi nie odwzajemniło.',
  },
  glosRainbowZmienilem: {
    en: 'I changed my mind about what I just said. Whatever it was.',
    pl: 'Zmieniłem zdanie co do tego, co powiedziałem. Cokolwiek to było.',
  },
  glosRainbowPowitanie: {
    en: 'Surprise! It is me. It could have been anything.',
    pl: 'Niespodzianka! To ja. Mogło być cokolwiek.',
  },

  // ── Rotten Baby — obrzydliwy, wilgotny, produkuje muchy ──
  glosRottenMuchy: {
    en: 'I made you some flies. They came out of me.',
    pl: 'Zrobiłem Ci trochę much. Wyszły ze mnie.',
  },
  glosRottenZapach: {
    en: 'Do you smell that? That is loyalty. Mostly.',
    pl: 'Czujesz to? To lojalność. W większości.',
  },
  glosRottenKawalek: {
    en: 'A piece of me fell off. Keep it, it is still warm.',
    pl: 'Odpadł ze mnie kawałek. Weź go, jeszcze ciepły.',
  },
  glosRottenNieDotykaj: {
    en: 'Do not touch me. Actually, do. Let us see what happens.',
    pl: 'Nie dotykaj mnie. Chociaż dotknij. Zobaczymy, co będzie.',
  },
  glosRottenWilgotno: {
    en: 'I am moist in a way that concerns everyone.',
    pl: 'Jestem wilgotny w sposób, który martwi wszystkich.',
  },
  glosRottenJadles: {
    en: 'You are eating while you read this. Bold.',
    pl: 'Jesz coś, czytając to. Odważnie.',
  },
  glosRottenPowitanie: {
    en: 'You are back! Something dripped when I said that.',
    pl: 'Wróciłeś! Coś kapnęło, gdy to mówiłem.',
  },

  // ── Dry Baby — sucho, beznamiętnie, minimum słów ──
  glosDryBezLez: { en: 'I have no tears left. Convenient.', pl: 'Nie mam już łez. Wygodne.' },
  glosDryNieCieszSie: {
    en: 'Do not get excited. Statistically, no.',
    pl: 'Nie ciesz się. Statystycznie — nie.',
  },
  glosDryTak: { en: 'Yes.', pl: 'Tak.' },
  glosDryPusto: { en: 'Empty inside. The room too.', pl: 'Pusto w środku. W pokoju też.' },
  glosDryNieWarto: {
    en: 'You could stop now. You will not.',
    pl: 'Mógłbyś teraz przestać. Nie przestaniesz.',
  },
  glosDryKosc: {
    en: 'I am mostly bone. It is a lifestyle.',
    pl: 'Jestem głównie kością. To styl życia.',
  },
  glosDryPowitanie: { en: 'Oh. It is you.', pl: 'A. To Ty.' },

  // ── Little C.H.A.D — potrzebujący akceptacji, mięsny, wciska serca ──
  glosChadSerce: {
    en: 'I brought you a heart. It had been used already.',
    pl: 'Przyniosłem Ci serce. Było już używane.',
  },
  glosChadLubiszMnie: {
    en: 'Do you like me? Be honest. Actually do not.',
    pl: 'Lubisz mnie? Powiedz szczerze. Chociaż nie mów.',
  },
  glosChadMieso: {
    en: 'I am mostly meat and good intentions.',
    pl: 'Jestem głównie mięsem i dobrymi chęciami.',
  },
  glosChadZostan: {
    en: 'Stay a bit longer. I get strange on my own.',
    pl: 'Zostań trochę dłużej. Sam robię się dziwny.',
  },
  glosChadNieWymieniaj: {
    en: 'Do not swap me out. I saw you open Settings.',
    pl: 'Nie wymieniaj mnie. Widziałem, jak otwierasz Ustawienia.',
  },
  glosChadPrzytul: {
    en: 'Hug? No? Fine. I will hold the heart.',
    pl: 'Przytulisz? Nie? Dobra. Potrzymam serce.',
  },
  glosChadPowitanie: {
    en: 'You came back for me! Or for the app. Either way.',
    pl: 'Wróciłeś do mnie! Albo do apki. Nieważne.',
  },

  // ── Lil Loki — trickster, wszystko w krzyż, kłamie dla zabawy ──
  glosLokiCztery: {
    en: 'Four directions. One of them is always wrong.',
    pl: 'Cztery kierunki. Jeden jest zawsze zły.',
  },
  glosLokiKrzyz: {
    en: 'I shoot in a cross. Subtlety is not on the menu.',
    pl: 'Strzelam w krzyż. Subtelności nie ma w menu.',
  },
  glosLokiKlamie: {
    en: 'Everything I say is true. That one was not.',
    pl: 'Wszystko, co mówię, jest prawdą. To akurat nie.',
  },
  glosLokiObejrzSie: { en: 'Look behind you. No reason.', pl: 'Obejrzyj się. Bez powodu.' },
  glosLokiZamiana: {
    en: 'I moved something. You will find it eventually.',
    pl: 'Przestawiłem coś. Kiedyś znajdziesz.',
  },
  glosLokiWybierz: {
    en: 'Pick a door. I already know which one is bad.',
    pl: 'Wybierz drzwi. Już wiem, które są złe.',
  },
  glosLokiPowitanie: {
    en: 'You are exactly where I left you. Suspicious.',
    pl: 'Jesteś dokładnie tam, gdzie Cię zostawiłem. Podejrzane.',
  },

  // ── Robo Baby — techniczny, chłodny, wszystko loguje ──
  glosRoboAnaliza: {
    en: 'Analysis complete. Result: skill issue.',
    pl: 'Analiza zakończona. Wynik: skill issue.',
  },
  glosRoboSzansa: {
    en: 'Survival probability: acceptable. Barely.',
    pl: 'Prawdopodobieństwo przeżycia: akceptowalne. Ledwo.',
  },
  glosRoboBlad: {
    en: 'ERROR: emotion module not installed.',
    pl: 'BŁĄD: moduł emocji nie zainstalowany.',
  },
  glosRoboLog: {
    en: 'Logging your deaths. The file is large.',
    pl: 'Loguję Twoje śmierci. Plik jest duży.',
  },
  glosRoboOptymalizacja: {
    en: 'Your build is suboptimal. I have prepared a report.',
    pl: 'Twój build jest nieoptymalny. Przygotowałem raport.',
  },
  glosRoboNieCzuje: {
    en: 'I do not feel pride. I do register progress.',
    pl: 'Nie czuję dumy. Rejestruję postęp.',
  },
  glosRoboPowitanie: {
    en: 'Unit online. Player detected. Expectations calibrated low.',
    pl: 'Jednostka online. Wykryto gracza. Oczekiwania skalibrowane nisko.',
  },

  // ── Freezer Baby — chłodny dystans, wszystko mrozi ──
  glosFreezerZimno: {
    en: 'Everything is better frozen. This conversation included.',
    pl: 'Wszystko jest lepsze zamrożone. Ta rozmowa też.',
  },
  glosFreezerNieRuszaj: {
    en: 'I froze it. It will not bother you again.',
    pl: 'Zamroziłem to. Już Ci nie przeszkodzi.',
  },
  glosFreezerCieplo: {
    en: 'You are radiating warmth. Stop it.',
    pl: 'Promieniujesz ciepłem. Przestań.',
  },
  glosFreezerCierpliwosc: {
    en: 'Take your time. I am not going to melt.',
    pl: 'Nie spiesz się. Nie roztopię się.',
  },
  glosFreezerUczucia: {
    en: 'My feelings are on ice. Where they belong.',
    pl: 'Moje uczucia są na lodzie. Tam, gdzie ich miejsce.',
  },
  glosFreezerKostka: {
    en: 'I am a baby in a freezer. Nobody ever asks why.',
    pl: 'Jestem dzieckiem w zamrażarce. Nikt nigdy nie pyta dlaczego.',
  },
  glosFreezerPowitanie: {
    en: 'You are back. The room just got colder.',
    pl: 'Wróciłeś. Zrobiło się chłodniej.',
  },

  // ── Acid Baby — żrący, na pigułkach, lekko niepoczytalny ──
  glosAcidPigulka: {
    en: 'Take the pill. It is probably fine. Probably.',
    pl: 'Weź pigułkę. Chyba nic się nie stanie. Chyba.',
  },
  glosAcidRozpuszcza: {
    en: 'I dissolved something. It was yours.',
    pl: 'Rozpuściłem coś. To było Twoje.',
  },
  glosAcidNieLiz: { en: 'Do not lick me. I am asking once.', pl: 'Nie liż mnie. Proszę raz.' },
  glosAcidPodloga: {
    en: 'The floor is breathing. That is normal down here.',
    pl: 'Podłoga oddycha. Tu to normalne.',
  },
  glosAcidPh: { en: 'My pH is a war crime.', pl: 'Moje pH to zbrodnia wojenna.' },
  glosAcidWiecejPigulek: {
    en: 'More pills. That is the strategy. That is all of it.',
    pl: 'Więcej pigułek. To jest strategia. Cała.',
  },
  glosAcidPowitanie: {
    en: 'You are back and I have pills. Great combination.',
    pl: 'Wróciłeś, a ja mam pigułki. Świetne połączenie.',
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * PORADA DNIA — jedna kwestia na dobę, STABILNA (patrz `poradaDnia`).
   * Losowanie przy każdym renderze wyglądałoby jak błąd, więc wybór idzie z seeda dnia.
   * ────────────────────────────────────────────────────────────────────────── */
  poradaDniaJedenRun: {
    en: 'Advice for today: one more run than yesterday. That is the whole bar.',
    pl: 'Porada na dziś: jeden run więcej niż wczoraj. Taka poprzeczka.',
  },
  poradaDniaNieRerolluj: {
    en: 'Today: stop rerolling the first floor. It is not the floor’s fault.',
    pl: 'Na dziś: przestań rerollować pierwsze piętro. To nie wina piętra.',
  },
  poradaDniaPrzerwa: {
    en: 'Today: take the break before the tilt, not after it.',
    pl: 'Na dziś: zrób przerwę przed tiltem, nie po.',
  },
  poradaDniaJedenAch: {
    en: 'Goal for today: one achievement. Just one. I will notice.',
    pl: 'Cel na dziś: jeden achievement. Jeden. Zauważę.',
  },
  poradaDniaPrzeczytaj: {
    en: 'Today: read the item description before you cry about it.',
    pl: 'Na dziś: przeczytaj opis itemu, zanim się nad nim popłaczesz.',
  },
  poradaDniaWoda: {
    en: 'Drink some water. Your tears come from somewhere.',
    pl: 'Napij się wody. Twoje łzy skądś się biorą.',
  },
  poradaDniaTrudnaPostac: {
    en: 'Today: play the character you hate. It builds character.',
    pl: 'Na dziś: zagraj postacią, której nie znosisz. Buduje charakter.',
  },
  poradaDniaDevilDeal: {
    en: 'Today: take the Devil deal. Regret is content too.',
    pl: 'Na dziś: weź Devil deal. Żal to też treść.',
  },
  poradaDniaBezWiki: {
    en: 'Today: no wiki. Guess, like your ancestors did.',
    pl: 'Na dziś: bez wiki. Zgaduj, jak Twoi przodkowie.',
  },
  poradaDniaWolniej: {
    en: 'Today: go slower. The room is not going anywhere.',
    pl: 'Na dziś: wolniej. Pokój nigdzie nie ucieknie.',
  },
  poradaDniaBomba: {
    en: 'Today: bomb one suspicious wall. Just one. Live a little.',
    pl: 'Na dziś: zbombarduj jedną podejrzaną ścianę. Jedną. Poszalej.',
  },
  poradaDniaDokoncz: {
    en: 'Advice for today: finish the run you are afraid to finish.',
    pl: 'Porada na dziś: dokończ ten run, którego się boisz.',
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * WIELKIE MOMENTY — Dead God, Platinum God, 1000000%, Real Platinum God.
   * Celowo dłuższe i cięższe od zwykłych kwestii: to ma być moment, a nie kolejna
   * linijka w pętli. Mówione RAZ (patrz `idx_companion_swietowane` w KolekcjaWidok).
   * ────────────────────────────────────────────────────────────────────────── */
  wielkiDeadGod: {
    en: 'Dead God. Every mark, every character, every tear. There is nothing left down here for you.',
    pl: 'Dead God. Każda marka, każda postać, każda łza. Nie ma tu już na dole nic dla Ciebie.',
  },
  wielkiPlatinumGod: {
    en: 'Platinum God. The basement has officially run out of things to hide from you.',
    pl: 'Platinum God. Piwnicy oficjalnie skończyło się to, co mogła przed Tobą ukryć.',
  },
  wielkiMilion: {
    en: '1000000%. That is not a percentage any more. That is a diagnosis.',
    pl: '1000000%. To już nie jest procent. To diagnoza.',
  },
  wielkiRealPlatinumGod: {
    en: 'Real Platinum God. Not the other one. The real one. Sit down for a second.',
    pl: 'Real Platinum God. Nie ten drugi. Ten prawdziwy. Usiądź na chwilę.',
  },

  // ── Postęp kolekcji (procent) — komentarz po synchronizacji ──
  postepStart: {
    en: '{procent}% done. Still deep in the basement, but at least we are in it together.',
    pl: '{procent}% zrobione. Wciąż głęboko w piwnicy, ale przynajmniej razem.',
  },
  postepPolowa: {
    en: '{procent}%. Past halfway. The second half is the mean one.',
    pl: '{procent}%. Ponad połowa. Ta druga połowa jest złośliwa.',
  },
  postepBlisko: {
    en: '{procent}%. Close enough to smell it. Do not look at what is left.',
    pl: '{procent}%. Już to czuć. Nie patrz na to, co zostało.',
  },
  postepPrawie: {
    en: '{procent}%. A handful left. They are the worst ones, obviously.',
    pl: '{procent}%. Zostało kilka. Te najgorsze, oczywiście.',
  },
  postepKomplet: {
    en: '100%. All of it. I genuinely do not know what to say to you now.',
    pl: '100%. Wszystko. Serio nie wiem, co mam Ci teraz powiedzieć.',
  },

  // ── Synchronizacja — ile nowego doszło od ostatniego razu ──
  syncNowe: {
    en: {
      one: 'One new achievement since last time. I saw it.',
      other: '{liczba} new achievements since last time. Show-off.',
    },
    pl: {
      one: 'Jeden nowy achievement od ostatniego razu. Widziałem.',
      few: '{liczba} nowe achievementy od ostatniego razu. Popisujesz się.',
      many: '{liczba} nowych achievementów od ostatniego razu. Popisujesz się.',
      other: '{liczba} nowych achievementów od ostatniego razu. Popisujesz się.',
    },
  },
  syncBezZmian: {
    en: 'Nothing new. The save file is exactly as disappointed as before.',
    pl: 'Nic nowego. Save file jest dokładnie tak samo zawiedziony jak wcześniej.',
  },

  // ── Puste stany ──
  pustoKolekcja: {
    en: 'Nothing here yet. An empty collection is just a very early collection.',
    pl: 'Jeszcze tu pusto. Pusta kolekcja to po prostu bardzo wczesna kolekcja.',
  },

  // ── Interfejs maskotki ──
  przedstawienieSie: {
    en: "Hi! It's me from now on — {nazwa}.",
    pl: 'Cześć! Teraz to ja — {nazwa}.',
  },
  odcisz: { en: 'Unmute {nazwa}', pl: 'Odcisz {nazwa}' },
  wycisz: { en: 'Mute {nazwa}', pl: 'Wycisz {nazwa}' },
  klikBySieOdciszyc: { en: 'Click to unmute', pl: 'Kliknij, by odciszyć' },
  klikBySieWyciszyc: { en: 'Click to mute', pl: 'Kliknij, by wyciszyć' },

  // ── Wybór familiara (Ustawienia) ──
  wyborTwojTowarzysz: { en: 'Your companion', pl: 'Twój towarzysz' },
  wyborOpisTowarzysza: {
    en: 'Sits in the top bar and comments on whatever you are doing.',
    pl: 'Siedzi w pasku u góry i komentuje, co robisz.',
  },

  // ── Basement Radio (nazwa własna zostaje) ──
  radioWlacz: { en: 'Turn on the radio', pl: 'Włącz radio' },
  radioSeedDnia: { en: 'Seed of the day', pl: 'Seed dnia' },
} satisfies Przestrzen
