import type { Nastroj } from '@/lib/companionGlos'
import type { Klucz } from '@/lib/i18n/slownik'

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

/** Pula kwestii companiona zależna od strony (reaguje na sekcję). Osobne teksty per zakładka.
 *  Zwraca KLUCZE słownika — tekst robi z nich `t()` w komponencie. */
export function kwestie(
  pathname: string,
  steamConnected = true,
  zalogowany = true,
): KwestiaKlucz[] {
  // Gość ma pierwszeństwo: zamiast namawiać na Steam, namawiamy na konto (+ trochę żartów).
  if (!zalogowany) return [...GOSC, ...FUNNY]
  // Zalogowany bez Steama — najpierw popchnij do synchronizacji.
  if (!steamConnected) return [...STEAM_OFF, ...GENERAL, ...TIPS]

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
  return [...page, ...GENERAL, ...FUNNY, ...TIPS]
}

/**
 * Domyślna mina maskotki dla danej sekcji, gdy gada „sama z siebie" (idle).
 * Pulpit/znajomi = radośnie, kalkulator/encyklopedia = w zamyśleniu, gość = smutno-proszący.
 * Reakcje na akcje (unlock, klik, dodanie itemu) nadają własną minę przez `powiedz`.
 */
export function nastrojStrony(pathname: string, zalogowany = true): Nastroj {
  if (!zalogowany) return 'sad'
  if (pathname === '/' || pathname.startsWith('/znajomi')) return 'happy'
  if (pathname.startsWith('/kalkulator') || pathname.startsWith('/encyklopedia')) return 'thinking'
  return 'zwykly'
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
): { klucz: KwestiaKlucz; nastroj: Nastroj } {
  if (!zalogowany) return { klucz: 'companion.wejscieGosc', nastroj: 'sad' }
  if (!steamConnected) return { klucz: 'companion.wejscieSteamOff', nastroj: 'thinking' }
  if (pathname === '/') return { klucz: 'companion.wejsciePulpit', nastroj: 'excited' }
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
