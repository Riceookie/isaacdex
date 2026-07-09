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

const DORADCA = [
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
export function kwestie(pathname: string, steamConnected = true): string[] {
  // Brak podłączonego Steama ma pierwszeństwo — najpierw namów do synchronizacji.
  if (!steamConnected) return [...STEAM_OFF, ...GENERAL]

  let page: string[]
  if (pathname === '/') page = [...HOME, ...OPENING]
  else if (pathname.startsWith('/kim-jestem')) page = PROFILE
  else if (pathname.startsWith('/profil')) page = PROFILE
  else if (pathname.startsWith('/kolekcja')) page = ACHIEVEMENTS
  else if (pathname.startsWith('/doradca')) page = DORADCA
  else if (pathname.startsWith('/statystyki')) page = STATYSTYKI
  else if (pathname.startsWith('/znajomi')) page = ZNAJOMI
  else if (pathname.startsWith('/czat')) page = CHAT
  else if (pathname.startsWith('/ustawienia')) page = USTAWIENIA
  else page = GENERAL

  return [...page, ...GENERAL, ...FUNNY]
}
