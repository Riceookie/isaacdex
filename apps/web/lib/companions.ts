import type { Nastroj } from '@/lib/companionGlos'

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

// ── Kwestie companiona (PL) — pogrupowane, reagują na aktualną sekcję ──
const GENERAL = [
  'Witaj z powrotem.',
  'Kolejny dzień w piwnicy.',
  'Wciąż bez Dead Goda?',
  'Spokojnie, dziś ten run się uda.',
  'Powodzenia. Przyda się.',
  'Wierzę w Ciebie. Prawie.',
  'Postaraj się dziś nie mieć skill issue.',
  'Piwnica za Tobą tęskniła.',
  'Już wracasz?',
  'Czas przegrać kolejny run.',
]

// Otwarcie apki — dorzucane do puli Pulpitu.
const OPENING = [
  'Twój save file czeka.',
  'Kto dziś oberwie traumą?',
  'Zobaczmy, co u innych.',
  'Oby streak przeżył.',
  'Czuję zapach itemu jakości 0.',
]

// Steam niepodłączony — popchnij do synchronizacji.
const STEAM_OFF = [
  'Psst… podłącz Steam, żebym mógł podglądać Twoje achievementy.',
  'Nie zsynchronizuję wyimaginowanych achievementów.',
  'Najpierw Steam, potem chwała.',
]

// Gość (niezalogowany) — namawiamy do założenia konta, ciepło i z humorem.
const GOSC = [
  'Nawet Isaac musiał gdzieś zacząć. Załóż konto.',
  'Bez konta jestem tylko ładną maskotką.',
  'Zaloguj się — obiecuję nie gryźć. Za bardzo.',
  'Twój save file gdzieś tam czeka. Serio.',
  'Piwnica ma wolne łóżko. Zaloguj się i wejdź.',
  'Konto za darmo, trauma gratis.',
  'Nie oglądaj cudzych achievementów. Zdobądź własne.',
]

const HOME = [
  'Świeże ploteczki z piwnicy.',
  'Ktoś dobił Dead Goda pod Twoją nieobecność.',
  'Ludzie uwielbiają wrzucać połamane runy.',
  'O Twoim ostatnim runie… nie rozmawiamy.',
]

const PROFILE = [
  'Nieźle wyglądasz.',
  'Ładne staty. Ignoruj śmierci.',
  'Bio przydałoby się trochę charakteru.',
  'Pochwal się achievementami.',
]

const ACHIEVEMENTS = [
  'Już prawie.',
  'Po jednym odblokowaniu na raz.',
  'Completioniści mnie przerażają.',
  'Dead God sam się nie odblokuje.',
]

const ENCYKLOPEDIA = [
  'Kliknij item — powiem, brać czy zostawić.',
  'Brać czy zostawić? Pytaj śmiało.',
  'Ten item? Weź. Zaufaj mi.',
  'Zostaw to. Serio.',
]

const STATYSTYKI = [
  'Twoje liczby wyglądają nieźle.',
  'Wykresy nie kłamią.',
  'Widać progres!',
  'Śmierci nie liczymy, prawda?',
]

const ZNAJOMI = [
  'Zobacz, co ubili znajomi.',
  'Kto dziś gra?',
  'Pochwal się runem!',
  'Nie zazdrość Dead Goda.',
]

const CHAT = [
  'Bądź miły.',
  'Albo chociaż zabawny.',
  'Ktoś znowu kłóci się o Jacob & Esau.',
  'Pamiętaj: żadnych spoilerów seedów.',
]

const USTAWIENIA = [
  'Możesz mnie tu zmienić na innego familiara.',
  'Wybierz sobie kumpla.',
  'Tainted rządzi.',
]

const KALKULATOR = [
  'Dorzuć item — pokażę, co zrobi ze statami.',
  'Damage czy szybkostrzelność? Klasyk.',
  'Uważaj na ujemny zasięg łez.',
  'Speed ma limit. Damage prawie nie.',
  'Polyphemus + wysoki damage = poezja.',
]

// Porady „z życia piwnicy" — wpadają od czasu do czasu na każdej stronie.
const TIPS = [
  'Tip: łzy w górę? To pewnie Curse of the Blind.',
  'Tip: Sklep zawsze warto sprawdzić przed bossem.',
  'Tip: Devil Room lubi Twoje serduszka.',
  'Tip: nie każdy quality 4 pasuje do Twojego buildu.',
  'Tip: Bomby otwierają więcej niż drzwi.',
  'Tip: The D6 to najlepszy przyjaciel Isaaca.',
  'Tip: czerwone serca kontra soul hearts — wybieraj mądrze.',
]

const FUNNY = [
  'Ed zapomniał mnie znerfić.',
  'Butter Bean jest niedoceniany.',
  'Wyznawcy „braku Chaosa" w rozsypce.',
  'Zawsze jest Curse of the Blind.',
  '50/50. Albo się uda, albo nie.',
  'Kolejny quality 4? No pewnie.',
  'Skill issue.',
  'Ustawione.',
  'We ball.',
  'Balowanie ma konsekwencje.',
  'Nie bierz TMTRAINER.',
  'Wziąłeś TMTRAINER, co nie?',
  'Sacred Heart się manifestuje…',
  'Wina Curse of the Lost.',
  'Przeciętne doświadczenie Tainted Lost.',
]

/** Pula kwestii companiona zależna od strony (reaguje na sekcję). Osobne teksty per zakładka. */
export function kwestie(pathname: string, steamConnected = true, zalogowany = true): string[] {
  // Gość ma pierwszeństwo: zamiast namawiać na Steam, namawiamy na konto (+ trochę żartów).
  if (!zalogowany) return [...GOSC, ...FUNNY]
  // Zalogowany bez Steama — najpierw popchnij do synchronizacji.
  if (!steamConnected) return [...STEAM_OFF, ...GENERAL, ...TIPS]

  let page: string[]
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
 */
export function wejscie(
  pathname: string,
  steamConnected = true,
  zalogowany = true,
): { tekst: string; nastroj: Nastroj } {
  if (!zalogowany)
    return { tekst: 'Rozejrzyj się. A potem załóż konto — będzie lepiej.', nastroj: 'sad' }
  if (!steamConnected) return { tekst: 'Podłącz Steam, a ożyję na dobre.', nastroj: 'thinking' }
  if (pathname === '/') return { tekst: 'Świeże ploteczki z piwnicy!', nastroj: 'excited' }
  if (pathname.startsWith('/kolekcja'))
    return { tekst: 'Obejrzyjmy te trofea!', nastroj: 'excited' }
  if (pathname.startsWith('/statystyki'))
    return { tekst: 'Czas na liczby. Śmierci pomijamy.', nastroj: 'happy' }
  if (pathname.startsWith('/kalkulator'))
    return { tekst: 'Pobawmy się statami. Dorzuć item.', nastroj: 'thinking' }
  if (pathname.startsWith('/encyklopedia'))
    return { tekst: 'Kliknij item — powiem, brać czy zostawić.', nastroj: 'thinking' }
  if (pathname.startsWith('/znajomi'))
    return { tekst: 'Zobaczmy, co ubili znajomi!', nastroj: 'happy' }
  if (pathname.startsWith('/czat'))
    return { tekst: 'Bądź miły. Albo chociaż zabawny.', nastroj: 'zwykly' }
  if (pathname.startsWith('/ustawienia'))
    return { tekst: 'Możesz mnie tu wymienić na innego kumpla.', nastroj: 'happy' }
  if (pathname.startsWith('/profil') || pathname.startsWith('/kim-jestem'))
    return { tekst: 'Twój kąt piwnicy. Nieźle wygląda.', nastroj: 'happy' }
  return { tekst: 'Kolejny dzień w piwnicy.', nastroj: 'zwykly' }
}
