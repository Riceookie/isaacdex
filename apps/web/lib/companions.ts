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

// ── Kwestie companiona (EN) — pogrupowane, reagują na aktualną sekcję ──
const GENERAL = [
  'Welcome back.',
  'Another day in the basement.',
  'Still no Dead God?',
  "Don't worry, today's the run.",
  "Good luck. You'll need it.",
  'I believe in you. Mostly.',
  'Try not to skill issue today.',
  'The basement missed you.',
  'Back already?',
  'Time to lose another run.',
]

// Otwarcie apki — dorzucane do puli Pulpitu.
const OPENING = [
  'Your save file awaits.',
  "Who's getting traumatized today?",
  "Let's see what everyone's been up to.",
  'Hope your streak survived.',
  'I smell a quality 0 item.',
]

// Steam niepodłączony — popchnij do synchronizacji.
const STEAM_OFF = [
  'Psst... connect Steam so I can stalk your achievements.',
  "I can't sync imaginary achievements.",
  'Steam first, glory later.',
]

const HOME = [
  'Fresh basement gossip.',
  'Someone unlocked Dead God while you were gone.',
  'People really love posting broken runs.',
  "Your last run... we don't talk about it.",
]

const PROFILE = [
  'Looking good.',
  'Nice stats. Ignore the deaths.',
  'The bio could use some personality.',
  'Flex those achievements.',
]

const ACHIEVEMENTS = [
  'Almost there.',
  'One unlock at a time.',
  'Completionists scare me.',
  "Dead God won't unlock itself.",
]

const CHAT = [
  'Be nice.',
  'Or at least be funny.',
  "Someone's arguing about Jacob & Esau again.",
  'Remember: no seed spoilers.',
]

const FUNNY = [
  'Ed forgot to nerf me.',
  'Butter Bean is underrated.',
  'Chaos deniers in shambles.',
  "It's always Curse of the Blind.",
  "50/50. It either happens or it doesn't.",
  'Another quality 4? Surely.',
  'Skill issue.',
  'Rigged.',
  'We ball.',
  'Balling has consequences.',
  "Don't pick up TMTRAINER.",
  "You picked up TMTRAINER, didn't you?",
  'Sacred Heart manifesting...',
  'I blame Curse of the Lost.',
  'Average Tainted Lost experience.',
]

/** Pula kwestii companiona zależna od strony (reaguje na sekcję). */
export function kwestie(pathname: string, steamConnected = true): string[] {
  // Brak podłączonego Steama ma pierwszeństwo — najpierw namów do synchronizacji.
  if (!steamConnected) return [...STEAM_OFF, ...GENERAL]

  let page: string[]
  if (pathname === '/') page = [...HOME, ...OPENING]
  else if (pathname.startsWith('/profil') || pathname.startsWith('/kim-jestem')) page = PROFILE
  else if (pathname.startsWith('/kolekcja')) page = ACHIEVEMENTS
  else if (pathname.startsWith('/czat')) page = CHAT
  else page = GENERAL

  return [...page, ...GENERAL, ...FUNNY]
}
