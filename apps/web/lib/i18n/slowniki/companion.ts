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
