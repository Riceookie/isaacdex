import { hash, statyGracza, zListy } from '@/lib/klimat'

/**
 * Zmyślone (ale STAŁE) dane profilu gracza demo.
 *
 * Po co: Steam ma podpięty tylko właściciel apki — pozostali gracze nie mają ani jednego
 * wiersza Profil, więc sekcje „Ostatnie achievementy" i „Postępy postaci" nie mają z czego
 * powstać. Zamiast pokazywać u każdego pustkę, dorabiamy je z nicku.
 *
 * Zasady:
 *  - Wszystko liczone z `hash(nick)`, nigdy Math.random() — profil ma wyglądać tak samo przy
 *    każdym wejściu (i tak samo na serwerze co na kliencie).
 *  - NAZWY i IKONY achievementów oraz lista postaci są PRAWDZIWE (katalog gry z bazy) —
 *    zmyślamy tylko to, KTO co odblokował. Wymyślanie nazw dałoby bzdury w stylu „Dead Gd".
 *  - Procent zgadza się z `statyGracza(nick).procent`, czyli z liczbą pokazywaną na kartach
 *    w „Odkryj graczy" i na liście znajomych — profil nie może przeczyć liście.
 *
 * Wszystko, co stąd wychodzi, leci do UI z etykietą DEMO.
 */

/**
 * Rozbicie hasha (finalizer w stylu xorshift-multiply).
 *
 * `hash` z klimatu to h*31+znak, więc ziarna różniące się OSTATNIM znakiem („x#1", „x#2")
 * dają hashe różniące się o 1 — a po `% 32` wychodziły z tego seedy-alfabety w rodzaju
 * „3456 789A" i „4567 89AB". Ten mikser rozrzuca bliskie wejścia po całym zakresie.
 */
function mieszaj(n: number): number {
  let h = n >>> 0
  h ^= h >>> 16
  h = Math.imul(h, 0x7feb352d) >>> 0
  h ^= h >>> 15
  h = Math.imul(h, 0x846ca68b) >>> 0
  h ^= h >>> 16
  return h >>> 0
}

/** Hash + rozbicie — do wszystkiego, co losujemy w tym pliku. */
const ziarnoDo = (s: string): number => mieszaj(hash(s))

export type PozycjaKatalogu = { nazwa: string; ikonaUrl: string | null }
export type DemoAch = { nazwa: string; ikonaUrl: string | null; data: string }
export type DemoRun = {
  wynik: 'WYGRANA' | 'PORAŻKA'
  boss: string
  czas: string
  piętro: string
  seed: string
  itemy: string[]
}

const BOSSOWIE_WIN = ['Delirium', 'Mother', 'The Beast', 'Mega Satan', 'Ultra Greed', 'Hush']
const BOSSOWIE_LOSS = ['???', 'Satan', 'The Lamb', 'Mom', 'Isaac']
const PIETRA = ['Home', 'Sheol', 'Womb II', 'Greed', 'Cathedral', 'Dark Room', 'Corpse II']
const ZNAKI = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const PULA_ITEMOW = [
  'Sacred Heart',
  'Brimstone',
  '20/20',
  'Godhead',
  'Tech X',
  'Polyphemus',
  'The D6',
  "Mom's Knife",
  'Incubus',
  'Magic Mushroom',
  'Epic Fetus',
  'Ipecac',
  'Holy Mantle',
  'Dark Arts',
  'Birthright',
]

/** Seed w stylu gry: „KJ4D 82LS" — stały dla danego ziarna, każdy znak z osobnego ziarna. */
function seedRunu(ziarno: string): string {
  let out = ''
  for (let i = 0; i < 8; i++) {
    if (i === 4) out += ' '
    out += ZNAKI[ziarnoDo(ziarno + '#' + i) % ZNAKI.length]
  }
  return out
}

/** N różnych elementów listy, deterministycznie (bez powtórek). */
function wybierz<T>(lista: T[], ile: number, ziarno: string): T[] {
  const pula = [...lista]
  const out: T[] = []
  for (let i = 0; i < ile && pula.length; i++) {
    out.push(pula.splice(ziarnoDo(ziarno + '#' + i) % pula.length, 1)[0])
  }
  return out
}

/**
 * Ostatnio odblokowane achievementy. Bierzemy PRAWDZIWE pozycje z katalogu gry i tylko
 * przypisujemy im daty — malejąco, żeby lista czytała się jak historia.
 */
export function demoRecent(nick: string, katalog: PozycjaKatalogu[], ile = 4): DemoAch[] {
  if (katalog.length === 0) return []
  const teraz = Date.now()
  return wybierz(katalog, ile, 'ach-' + nick).map((a, i) => {
    // i-ty wpis jest starszy od poprzedniego: 2–20 dni odstępu, stale dla nicku.
    const dni = 2 + (ziarnoDo(nick + 'dni' + i) % 18) + i * 9
    return {
      nazwa: a.nazwa,
      ikonaUrl: a.ikonaUrl,
      data: new Date(teraz - dni * 86_400_000).toISOString(),
    }
  })
}

/**
 * Postępy postaci. Kręcą się wokół ogólnego procentu gracza (±18 pkt), żeby profil
 * człowieka ze 100% nie pokazywał postaci po 40%.
 */
export function demoPostacie(
  nick: string,
  postacie: string[],
  ogolny: number,
): { nazwa: string; procent: number }[] {
  return postacie
    .map((nazwa) => {
      const odchyl = (ziarnoDo(nick + '::' + nazwa) % 37) - 18
      const procent = Math.max(0, Math.min(100, ogolny + odchyl))
      return { nazwa, procent }
    })
    .sort((a, b) => b.procent - a.procent || a.nazwa.localeCompare(b.nazwa))
}

/** Ostatnie runy — zaczynają się od ulubionego itemu gracza, żeby profil był spójny. */
export function demoRuny(nick: string, ile = 4): DemoRun[] {
  const ulubiony = statyGracza(nick).ulubiony
  return Array.from({ length: ile }, (_, i) => {
    const z = nick + '-run-' + i
    const wygrana = ziarnoDo(z + 'w') % 3 !== 0 // ~2/3 runów wygrane
    const min = 18 + (ziarnoDo(z + 'm') % 20)
    const sek = ziarnoDo(z + 's') % 60
    // Ulubiony item leci w pierwszym runie — reszta losowa, ale stała.
    const reszta = wybierz(
      PULA_ITEMOW.filter((it) => it !== ulubiony),
      2,
      z + 'i',
    )
    return {
      wynik: wygrana ? 'WYGRANA' : 'PORAŻKA',
      boss: wygrana ? zListy(BOSSOWIE_WIN, z + 'b') : zListy(BOSSOWIE_LOSS, z + 'b'),
      czas: `${min}:${String(sek).padStart(2, '0')}`,
      piętro: zListy(PIETRA, z + 'p'),
      seed: seedRunu(z),
      itemy: i === 0 ? [ulubiony, ...reszta] : wybierz(PULA_ITEMOW, 3, z + 'i'),
    }
  })
}

/**
 * Ulubiona postać gracza demo. Jeśli jego avatar to ikona postaci — bierzemy ją (to
 * prawdziwa dana). Jeśli wgrał własne zdjęcie, avatar nic nie mówi o mainie, więc
 * losujemy stałą postać z nicku — inaczej połowa profili miałaby „Isaac main".
 */
export function demoUlubionaPostac(nick: string, postacie: string[]): string {
  return postacie.length ? zListy(postacie, 'main-' + nick) : 'Isaac'
}

/** Ulubione itemy — pierwszy to ten z `statyGracza`, reszta dobrana stale z puli. */
export function demoUlubioneItemy(nick: string, ile = 5): string[] {
  const ulubiony = statyGracza(nick).ulubiony
  const reszta = wybierz(
    PULA_ITEMOW.filter((it) => it !== ulubiony),
    ile - 1,
    'fav-' + nick,
  )
  return [ulubiony, ...reszta]
}
