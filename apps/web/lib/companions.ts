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

// Ogólne teksty (mogą paść wszędzie) — trochę klimatu Isaaca.
const OGOLNE = (n: string) => [
  `Trzymam się Ciebie, ${n}.`,
  'Curse of the Blind wcale nie jest taka zła.',
  'Pamiętaj: nie płacz o skill issue.',
  'Brimstone > wszystko. Zmień moje zdanie.',
  'Może dziś Dead God, co?',
  'Jeden run więcej nikomu nie zaszkodził…',
  'Widziałeś ostatnio Guppy? Dobre combo.',
]

// Pula kwestii companiona zależna od strony (losowana + rotowana).
export function kwestie(pathname: string, nick: string): string[] {
  let base: string[]
  if (pathname === '/')
    base = [
      `Cześć ${nick}! Gotowy dobić Dead Goda?`,
      `Witaj z powrotem, ${nick}!`,
      `Miłego grindu, ${nick}!`,
      'Od czego dziś zaczynamy?',
    ]
  else if (pathname.startsWith('/doradca'))
    base = [
      'Kliknij item — powiem, czy brać czy zostawić.',
      'Brać czy zostawić? Pytaj śmiało.',
      'Pokaż mi item, ocenię go w mig.',
    ]
  else if (pathname.startsWith('/kolekcja'))
    base = [
      `Jeszcze kilka achievementów, ${nick}!`,
      'Którego brakuje Ci do setki?',
      'Ładna kolekcja się robi.',
    ]
  else if (pathname.startsWith('/statystyki'))
    base = ['Twoje liczby wyglądają nieźle.', `Wykresy nie kłamią, ${nick}.`, 'Widzę progres!']
  else if (pathname.startsWith('/znajomi'))
    base = ['Zobacz, co ubili znajomi.', 'Kto dziś gra?', 'Pochwal się runem!']
  else if (pathname.startsWith('/czat'))
    base = ['Bądź miły na czacie 😉', 'Pisz śmiało!', 'Nie karm trolli.']
  else if (pathname.startsWith('/profil') || pathname.startsWith('/kim-jestem'))
    base = [`Ładny profil, ${nick}.`, 'Fajny avatar!', 'Ulubiona postać wybrana?']
  else if (pathname.startsWith('/ustawienia'))
    base = [
      'Możesz mnie tu zmienić na innego familiara!',
      'Wybierz sobie kumpla.',
      'Tainted rządzi.',
    ]
  else base = [`Trzymam się Ciebie, ${nick}.`]

  return [...base, ...OGOLNE(nick)]
}
