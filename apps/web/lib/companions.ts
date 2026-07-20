import type { Nastroj } from '@/lib/companionGlos'
import type { Klucz } from '@/lib/i18n/slownik'
import { kluczDnia, wybierzZSeeda } from '@/lib/dailySeed'

/**
 * Kwestie maskotki trzymamy jako KLUCZE słownika, a nie gotowe napisy — ten moduł jest
 * czystymi danymi (bez Reacta), więc nie ma tu dostępu do tłumacza. Tekst powstaje dopiero
 * w `components/Companion.tsx`, który ma `useT()`. Dzięki temu zmiana języka w locie
 * przestawia też maskotkę, bez przeładowania strony.
 */
export type KwestiaKlucz = Extract<Klucz, `companion.${string}`>

// Companion = pływający familiar-maskotka. Wita po nicku, podpowiada, prowadzi do Doradcy.
export type Companion = {
  id: string
  nazwa: string
  file: string // ścieżka względem /tboi/
}

export const COMPANIONS: Companion[] = [
  { id: 'brotherbobby', nazwa: 'Brother Bobby', file: 'items/collectibles/brotherbobby.png' },
  { id: 'sistermaggy', nazwa: 'Sister Maggy', file: 'items/collectibles/sistermaggy.png' },
  { id: 'guardianangel', nazwa: 'Guardian Angel', file: 'items/collectibles/guardianangel.png' },
  { id: 'demonbaby', nazwa: 'Demon Baby', file: 'items/collectibles/demonbaby.png' },
  { id: 'ghostbaby', nazwa: 'Ghost Baby', file: 'items/collectibles/ghostbaby.png' },
  { id: 'lilbrimstone', nazwa: 'Lil Brimstone', file: 'items/collectibles/lilbrimstone.png' },
  { id: 'rainbowbaby', nazwa: 'Rainbow Baby', file: 'items/collectibles/rainbowbaby.png' },
  { id: 'rottenbaby', nazwa: 'Rotten Baby', file: 'items/collectibles/rottenbaby.png' },
  { id: 'drybaby', nazwa: 'Dry Baby', file: 'items/collectibles/drybaby.png' },
  { id: 'littlechad', nazwa: 'Little C.H.A.D', file: 'items/collectibles/littlechad.png' },
  { id: 'lilloki', nazwa: 'Lil Loki', file: 'items/collectibles/lilloki.png' },
  { id: 'robobaby', nazwa: 'Robo Baby', file: 'items/collectibles/robobaby.png' },
  { id: 'freezerbaby', nazwa: 'Freezer Baby', file: 'items/collectibles/freezerbaby.png' },
  { id: 'acidbaby', nazwa: 'Acid Baby', file: 'items/collectibles/acidbaby.png' },
]

export const DOMYSLNY_COMPANION = COMPANIONS[0]

export function companionZId(id: string | null): Companion {
  return COMPANIONS.find((c) => c.id === id) ?? DOMYSLNY_COMPANION
}

// ── Kwestie companiona — pogrupowane, reagują na aktualną sekcję ──
const GENERAL: KwestiaKlucz[] = [
  'companion.ogolneWitajZPowrotem',
  'companion.ogolneKolejnyDzien',
  'companion.ogolneWciazBezDeadGoda',
  'companion.ogolneDzisSieUda',
  'companion.ogolnePowodzeniaPrzydaSie',
  'companion.ogolneWierzePrawie',
  'companion.ogolneBezSkillIssue',
  'companion.ogolnePiwnicaTesknila',
  'companion.ogolneJuzWracasz',
  'companion.ogolneCzasPrzegrac',
]

// Otwarcie apki — dorzucane do puli Pulpitu.
const OPENING: KwestiaKlucz[] = [
  'companion.otwarcieSaveCzeka',
  'companion.otwarcieKtoOberwie',
  'companion.otwarcieCoUInnych',
  'companion.otwarcieObyStreak',
  'companion.otwarcieZapachJakosci0',
]

// Steam niepodłączony — popchnij do synchronizacji.
const STEAM_OFF: KwestiaKlucz[] = [
  'companion.steamPodlaczPodgladac',
  'companion.steamWyimaginowane',
  'companion.steamNajpierwPotemChwala',
]

// Gość (niezalogowany) — namawiamy do założenia konta, ciepło i z humorem.
const GOSC: KwestiaKlucz[] = [
  'companion.goscIsaacTezZaczynal',
  'companion.goscLadnaMaskotka',
  'companion.goscNieGryze',
  'companion.goscSaveCzeka',
  'companion.goscWolneLozko',
  'companion.goscKontoZaDarmo',
  'companion.goscZdobadzWlasne',
]

const HOME: KwestiaKlucz[] = [
  'companion.pulpitSwiezePloteczki',
  'companion.pulpitKtosDobilDeadGoda',
  'companion.pulpitPolamaneRuny',
  'companion.pulpitNieRozmawiamy',
]

const PROFILE: KwestiaKlucz[] = [
  'companion.profilNiezleWygladasz',
  'companion.profilLadneStaty',
  'companion.profilBioBezCharakteru',
  'companion.profilPochwalSie',
]

const ACHIEVEMENTS: KwestiaKlucz[] = [
  'companion.osiagnieciaJuzPrawie',
  'companion.osiagnieciaPoJednym',
  'companion.osiagnieciaCompletionisci',
  'companion.osiagnieciaDeadGodSamSie',
]

const ENCYKLOPEDIA: KwestiaKlucz[] = [
  'companion.encyklopediaKliknijItem',
  'companion.encyklopediaPytajSmialo',
  'companion.encyklopediaWezZaufajMi',
  'companion.encyklopediaZostawTo',
]

const STATYSTYKI: KwestiaKlucz[] = [
  'companion.statystykiLiczbyNiezle',
  'companion.statystykiWykresyNieKlamia',
  'companion.statystykiWidacProgres',
  'companion.statystykiSmierciNieLiczymy',
]

const ZNAJOMI: KwestiaKlucz[] = [
  'companion.znajomiCoUbili',
  'companion.znajomiKtoGra',
  'companion.znajomiPochwalSieRunem',
  'companion.znajomiNieZazdrosc',
]

const CHAT: KwestiaKlucz[] = [
  'companion.czatBadzMily',
  'companion.czatAlboZabawny',
  'companion.czatKlotniaJacobEsau',
  'companion.czatZadnychSpoilerow',
]

const USTAWIENIA: KwestiaKlucz[] = [
  'companion.ustawieniaZmienFamiliara',
  'companion.ustawieniaWybierzKumpla',
  'companion.ustawieniaTaintedRzadzi',
]

const KALKULATOR: KwestiaKlucz[] = [
  'companion.kalkulatorDorzucItem',
  'companion.kalkulatorDamageCzyTears',
  'companion.kalkulatorUjemnyZasieg',
  'companion.kalkulatorSpeedMaLimit',
  'companion.kalkulatorPolyphemusPoezja',
]

// Porady „z życia piwnicy" — wpadają od czasu do czasu na każdej stronie.
const TIPS: KwestiaKlucz[] = [
  'companion.tipLzyWGore',
  'companion.tipSklepPrzedBossem',
  'companion.tipDevilRoomSerduszka',
  'companion.tipQuality4NieZawsze',
  'companion.tipBombyOtwierajaWiecej',
  'companion.tipD6NajlepszyPrzyjaciel',
  'companion.tipSercaKontraSoulHearts',
]

const FUNNY: KwestiaKlucz[] = [
  'companion.zartEdZapomnialZnerfic',
  'companion.zartButterBean',
  'companion.zartBrakChaosuWRozsypce',
  'companion.zartZawszeCurseOfTheBlind',
  'companion.zartPiecdziesiatPiecdziesiat',
  'companion.zartKolejnyQuality4',
  'companion.zartSkillIssue',
  'companion.zartUstawione',
  'companion.zartWeBall',
  'companion.zartBalowanieKonsekwencje',
  'companion.zartNieBierzTmtrainer',
  'companion.zartWziolesTmtrainer',
  'companion.zartSacredHeartManifestuje',
  'companion.zartWinaCurseOfTheLost',
  'companion.zartTaintedLostDoswiadczenie',
]

/* ────────────────────────────────────────────────────────────────────────────
 * GŁOSY FAMILIARÓW
 *
 * Do tej pory wszystkie kwestie były wspólne, więc wybór familiara w Ustawieniach
 * zmieniał tylko obrazek — maskotka brzmiała identycznie. Tutaj każdy dostaje własną
 * pulę i własne powitanie, dokładane do KAŻDEJ strony, żeby charakter było słychać
 * wszędzie, a nie tylko przy jednej okazji.
 *
 * `nastroj` to domyślna mina w pętli idle. Demon Baby nie ma prawa robić `happy`,
 * a Dry Baby ani razu w życiu nie był `excited` — mina jest częścią charakteru.
 * ──────────────────────────────────────────────────────────────────────────── */
export type GlosFamiliara = {
  /** Kwestie charakterystyczne — dorzucane do puli każdej sekcji. */
  osobowosc: KwestiaKlucz[]
  /** Czym wita gracza przy wejściu do apki (Pulpit). */
  powitanie: KwestiaKlucz
  /** Domyślna mina idle — nadpisuje minę sekcji, bo charakter jest ważniejszy. */
  nastroj: Nastroj
}

const GLOSY: Record<string, GlosFamiliara> = {
  brotherbobby: {
    osobowosc: [
      'companion.glosBobbyStoje',
      'companion.glosBobbyNieOdejde',
      'companion.glosBobbyPierwszy',
      'companion.glosBobbyStrzelam',
      'companion.glosBobbyNiepotrzebny',
      'companion.glosBobbyDobryDzien',
    ],
    powitanie: 'companion.glosBobbyPowitanie',
    nastroj: 'zwykly',
  },
  sistermaggy: {
    osobowosc: [
      'companion.glosMaggyZjadlesCos',
      'companion.glosMaggyNieBiegaj',
      'companion.glosMaggyOpatrunek',
      'companion.glosMaggyPolHeartu',
      'companion.glosMaggyPostawa',
      'companion.glosMaggyDumna',
    ],
    powitanie: 'companion.glosMaggyPowitanie',
    nastroj: 'happy',
  },
  guardianangel: {
    osobowosc: [
      'companion.glosAngelChronie',
      'companion.glosAngelLza',
      'companion.glosAngelZasluzyles',
      'companion.glosAngelSwiatlo',
      'companion.glosAngelWierzeWCiebie',
      'companion.glosAngelNieZasmuc',
    ],
    powitanie: 'companion.glosAngelPowitanie',
    nastroj: 'happy',
  },
  demonbaby: {
    osobowosc: [
      'companion.glosDemonZginiesz',
      'companion.glosDemonSerduszko',
      'companion.glosDemonSmieszneStaty',
      'companion.glosDemonPodpisz',
      'companion.glosDemonPlaczesz',
      'companion.glosDemonZaslugujesz',
    ],
    powitanie: 'companion.glosDemonPowitanie',
    // `excited` = uciecha, nie radość — Demon Baby cieszy się z Twoich kłopotów.
    nastroj: 'excited',
  },
  ghostbaby: {
    osobowosc: [
      'companion.glosGhostPrzenikam',
      'companion.glosGhostCieplo',
      'companion.glosGhostByloDawno',
      'companion.glosGhostPrzezWrogow',
      'companion.glosGhostPamietasz',
      'companion.glosGhostCicho',
    ],
    powitanie: 'companion.glosGhostPowitanie',
    nastroj: 'sad',
  },
  lilbrimstone: {
    osobowosc: [
      'companion.glosBrimstoneLaser',
      'companion.glosBrimstoneWiecejDamage',
      'companion.glosBrimstoneNieUnikaj',
      'companion.glosBrimstoneCharge',
      'companion.glosBrimstoneSciana',
      'companion.glosBrimstoneTears',
    ],
    powitanie: 'companion.glosBrimstonePowitanie',
    nastroj: 'excited',
  },
  rainbowbaby: {
    osobowosc: [
      'companion.glosRainbowLosuje',
      'companion.glosRainbowNieWiem',
      'companion.glosRainbowKolor',
      'companion.glosRainbowKostka',
      'companion.glosRainbowRng',
      'companion.glosRainbowZmienilem',
    ],
    powitanie: 'companion.glosRainbowPowitanie',
    nastroj: 'excited',
  },
  rottenbaby: {
    osobowosc: [
      'companion.glosRottenMuchy',
      'companion.glosRottenZapach',
      'companion.glosRottenKawalek',
      'companion.glosRottenNieDotykaj',
      'companion.glosRottenWilgotno',
      'companion.glosRottenJadles',
    ],
    powitanie: 'companion.glosRottenPowitanie',
    nastroj: 'happy',
  },
  drybaby: {
    osobowosc: [
      'companion.glosDryBezLez',
      'companion.glosDryNieCieszSie',
      'companion.glosDryTak',
      'companion.glosDryPusto',
      'companion.glosDryNieWarto',
      'companion.glosDryKosc',
    ],
    powitanie: 'companion.glosDryPowitanie',
    nastroj: 'zwykly',
  },
  littlechad: {
    osobowosc: [
      'companion.glosChadSerce',
      'companion.glosChadLubiszMnie',
      'companion.glosChadMieso',
      'companion.glosChadZostan',
      'companion.glosChadNieWymieniaj',
      'companion.glosChadPrzytul',
    ],
    powitanie: 'companion.glosChadPowitanie',
    nastroj: 'happy',
  },
  lilloki: {
    osobowosc: [
      'companion.glosLokiCztery',
      'companion.glosLokiKrzyz',
      'companion.glosLokiKlamie',
      'companion.glosLokiObejrzSie',
      'companion.glosLokiZamiana',
      'companion.glosLokiWybierz',
    ],
    powitanie: 'companion.glosLokiPowitanie',
    nastroj: 'excited',
  },
  robobaby: {
    osobowosc: [
      'companion.glosRoboAnaliza',
      'companion.glosRoboSzansa',
      'companion.glosRoboBlad',
      'companion.glosRoboLog',
      'companion.glosRoboOptymalizacja',
      'companion.glosRoboNieCzuje',
    ],
    powitanie: 'companion.glosRoboPowitanie',
    nastroj: 'thinking',
  },
  freezerbaby: {
    osobowosc: [
      'companion.glosFreezerZimno',
      'companion.glosFreezerNieRuszaj',
      'companion.glosFreezerCieplo',
      'companion.glosFreezerCierpliwosc',
      'companion.glosFreezerUczucia',
      'companion.glosFreezerKostka',
    ],
    powitanie: 'companion.glosFreezerPowitanie',
    nastroj: 'zwykly',
  },
  acidbaby: {
    osobowosc: [
      'companion.glosAcidPigulka',
      'companion.glosAcidRozpuszcza',
      'companion.glosAcidNieLiz',
      'companion.glosAcidPodloga',
      'companion.glosAcidPh',
      'companion.glosAcidWiecejPigulek',
    ],
    powitanie: 'companion.glosAcidPowitanie',
    nastroj: 'thinking',
  },
}

export function glosFamiliara(id: string | null): GlosFamiliara {
  return GLOSY[id ?? ''] ?? GLOSY[DOMYSLNY_COMPANION.id]
}

/* ────────────────────────────────────────────────────────────────────────────
 * PORADA DNIA
 * ──────────────────────────────────────────────────────────────────────────── */
const PORADY_DNIA: KwestiaKlucz[] = [
  'companion.poradaDniaJedenRun',
  'companion.poradaDniaNieRerolluj',
  'companion.poradaDniaPrzerwa',
  'companion.poradaDniaJedenAch',
  'companion.poradaDniaPrzeczytaj',
  'companion.poradaDniaWoda',
  'companion.poradaDniaTrudnaPostac',
  'companion.poradaDniaDevilDeal',
  'companion.poradaDniaBezWiki',
  'companion.poradaDniaWolniej',
  'companion.poradaDniaBomba',
  'companion.poradaDniaDokoncz',
]

/**
 * Porada / zachęta na dziś — STABILNA w obrębie doby dla danego gracza.
 *
 * Świadomie NIE ma tu `Math.random()`: przy losowaniu każde odświeżenie strony dawałoby
 * inną poradę i wyglądałoby to jak błąd („czemu ona co chwilę mówi co innego?"). Wybór
 * idzie z hasha `dzień|gracz|familiar`, tak samo jak seed dnia w `lib/dailySeed.ts`:
 * ten sam gracz tego samego dnia dostaje zawsze tę samą kwestię, a o północy zmienia się
 * sama. `familiar` jest w kluczu celowo — zmiana towarzysza ma odświeżyć poradę, bo to
 * wtedy wygląda jak inna osoba, a nie jak zacięta płyta.
 */
export function poradaDnia(gracz: string | null, familiarId: string | null, data = new Date()) {
  return wybierzZSeeda(
    PORADY_DNIA,
    `${kluczDnia(data)}|${gracz ?? 'gosc'}|${familiarId ?? DOMYSLNY_COMPANION.id}`,
  )
}

/* ────────────────────────────────────────────────────────────────────────────
 * WIELKIE ACHIEVEMENTY
 *
 * Klucze po nazwach ze Steama (nazwy własne z gry — po angielsku w obu językach).
 * Te cztery dostają własne, cięższe kwestie: zwykłe „nieźle!" przy Dead Godzie byłoby
 * marnowaniem momentu, na który ktoś zszedł setki godzin.
 * ──────────────────────────────────────────────────────────────────────────── */
export const WIELKIE_ACHIEVEMENTY: Record<string, KwestiaKlucz> = {
  'Dead God': 'companion.wielkiDeadGod',
  'Platinum God': 'companion.wielkiPlatinumGod',
  '1000000%': 'companion.wielkiMilion',
  'Real Platinum God': 'companion.wielkiRealPlatinumGod',
}

/** Dopasowanie odporne na wielkość liter i spacje — Steam bywa niechlujny w nazwach. */
export function wielkiAchievement(nazwa: string): KwestiaKlucz | null {
  const cel = nazwa.trim().toLowerCase()
  for (const [k, v] of Object.entries(WIELKIE_ACHIEVEMENTY)) {
    if (k.toLowerCase() === cel) return v
  }
  return null
}

/** Komentarz do postępu kolekcji — progi dobrane tak, żeby ton zmieniał się razem z procentem. */
export function kwestiaPostepu(procent: number): KwestiaKlucz {
  if (procent >= 100) return 'companion.postepKomplet'
  if (procent >= 90) return 'companion.postepPrawie'
  if (procent >= 75) return 'companion.postepBlisko'
  if (procent >= 50) return 'companion.postepPolowa'
  return 'companion.postepStart'
}

/** Pula kwestii companiona zależna od strony (reaguje na sekcję). Osobne teksty per zakładka.
 *  Zwraca KLUCZE słownika — tekst robi z nich `t()` w komponencie.
 *  `familiarId` domieszkuje kwestie charakterystyczne wybranego towarzysza. */
export function kwestie(
  pathname: string,
  steamConnected = true,
  zalogowany = true,
  familiarId: string | null = null,
): KwestiaKlucz[] {
  const osobowosc = glosFamiliara(familiarId).osobowosc
  // Gość ma pierwszeństwo: zamiast namawiać na Steam, namawiamy na konto (+ trochę żartów).
  if (!zalogowany) return [...osobowosc, ...GOSC, ...FUNNY]
  // Zalogowany bez Steama — najpierw popchnij do synchronizacji.
  if (!steamConnected) return [...osobowosc, ...STEAM_OFF, ...GENERAL, ...TIPS]

  let page: KwestiaKlucz[]
  if (pathname === '/') page = [...HOME, ...OPENING]
  else if (pathname.startsWith('/kim-jestem')) page = PROFILE
  else if (pathname.startsWith('/profil')) page = PROFILE
  else if (pathname.startsWith('/kolekcja')) page = ACHIEVEMENTS
  else if (pathname.startsWith('/encyklopedia')) page = ENCYKLOPEDIA
  else if (pathname.startsWith('/statystyki')) page = STATYSTYKI
  else if (pathname.startsWith('/kalkulator')) page = KALKULATOR
  else if (pathname.startsWith('/znajomi')) page = ZNAJOMI
  else if (pathname.startsWith('/czat')) page = CHAT
  else if (pathname.startsWith('/ustawienia')) page = USTAWIENIA
  else page = GENERAL

  // TIPS wpadają wszędzie od czasu do czasu — „porady, które zmieniają się co jakiś czas".
  //
  // `osobowosc` wchodzi DWA razy i w dwóch różnych miejscach listy. Pętla idle chodzi po puli
  // po kolei, więc pozycja = częstotliwość: przy jednym wystąpieniu 6 kwestii charakteru ginęłoby
  // wśród ~36 wspólnych i wybór familiara znów byłby niesłyszalny. Dwa rozstawione bloki dają
  // charakterowi mniej więcej co trzecią kwestię, równo rozłożoną w cyklu.
  return [...osobowosc, ...page, ...GENERAL, ...osobowosc, ...FUNNY, ...TIPS]
}

/**
 * Domyślna mina maskotki dla danej sekcji, gdy gada „sama z siebie" (idle).
 * Pulpit/znajomi = radośnie, kalkulator/encyklopedia = w zamyśleniu, gość = smutno-proszący.
 * Reakcje na akcje (unlock, klik, dodanie itemu) nadają własną minę przez `powiedz`.
 */
export function nastrojStrony(
  pathname: string,
  zalogowany = true,
  familiarId: string | null = null,
): Nastroj {
  // Gość jest wyjątkiem od charakteru: prosimy go o konto, więc nawet Demon Baby robi smutną minę.
  if (!zalogowany) return 'sad'
  // Kalkulator i Encyklopedia to sekcje „do myślenia" — tu mina sekcji wygrywa z charakterem.
  if (pathname.startsWith('/kalkulator') || pathname.startsWith('/encyklopedia')) return 'thinking'
  // Poza tym rządzi familiar: Ghost Baby nie ma się jak „ucieszyć" Pulpitem, a Demon Baby
  // nie robi `happy` nigdzie. Mina jest częścią osobowości, więc bije domyślną minę strony.
  return glosFamiliara(familiarId).nastroj
}

/**
 * Jednorazowa REAKCJA na wejście w sekcję (mówiona zaraz po nawigacji, przed pętlą idle).
 * Dzięki temu maskotka „wita" każdą stronę z odpowiednią miną — cheeruje przy osiągnięciach,
 * myśli przy kalkulatorze, zaprasza gościa do logowania.
 *
 * Zwraca KLUCZ, nie gotowy tekst — tak samo jak `kwestie`.
 */
export function wejscie(
  pathname: string,
  steamConnected = true,
  zalogowany = true,
  familiarId: string | null = null,
): { klucz: KwestiaKlucz; nastroj: Nastroj } {
  if (!zalogowany) return { klucz: 'companion.wejscieGosc', nastroj: 'sad' }
  if (!steamConnected) return { klucz: 'companion.wejscieSteamOff', nastroj: 'thinking' }
  // Wejście do apki (Pulpit) = moment, w którym familiar się przedstawia SWOIM głosem.
  // To pierwsza rzecz, jaką gracz słyszy w sesji, więc tu charakter niesie najwięcej.
  if (pathname === '/')
    return {
      klucz: glosFamiliara(familiarId).powitanie,
      nastroj: glosFamiliara(familiarId).nastroj,
    }
  if (pathname.startsWith('/kolekcja'))
    return { klucz: 'companion.wejscieKolekcja', nastroj: 'excited' }
  if (pathname.startsWith('/statystyki'))
    return { klucz: 'companion.wejscieStatystyki', nastroj: 'happy' }
  if (pathname.startsWith('/kalkulator'))
    return { klucz: 'companion.wejscieKalkulator', nastroj: 'thinking' }
  if (pathname.startsWith('/encyklopedia'))
    return { klucz: 'companion.encyklopediaKliknijItem', nastroj: 'thinking' }
  if (pathname.startsWith('/znajomi'))
    return { klucz: 'companion.wejscieZnajomi', nastroj: 'happy' }
  if (pathname.startsWith('/czat')) return { klucz: 'companion.wejscieCzat', nastroj: 'zwykly' }
  if (pathname.startsWith('/ustawienia'))
    return { klucz: 'companion.wejscieUstawienia', nastroj: 'happy' }
  if (pathname.startsWith('/profil') || pathname.startsWith('/kim-jestem'))
    return { klucz: 'companion.wejscieProfil', nastroj: 'happy' }
  return { klucz: 'companion.ogolneKolejnyDzien', nastroj: 'zwykly' }
}
