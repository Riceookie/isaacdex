import surowe from './postacie.json'

/**
 * Dane postaci z plików gry (players.xml + stringtable.sta) uzupełnione opisem i warunkiem
 * odblokowania z wiki. Statystyk liczbowych (damage/tears/speed) NIE ma ani w plikach gry,
 * ani w ustrukturyzowanej formie na wiki — są zaszyte w kodzie gry. Pokazujemy więc to,
 * co jest pewne: zdrowie, znajdźki na start, itemy startowe, birthright i odblokowanie.
 */
export type PostacDane = {
  nazwa: string
  tainted: boolean
  hp: number // w połówkach serc (6 = 3 serca)
  monety: number
  bomby: number
  klucze: number
  itemy: { id: number; nazwa: string }[] // itemy startowe
  birthright?: string | null // efekt Birthright
  achievement?: string | null // achievement odblokowujący postać
  warunek?: string | null // jak go zdobyć
  opis?: string | null
}

const DANE = surowe as PostacDane[]
const WG_NAZWY = new Map<string, PostacDane>(DANE.map((p) => [p.nazwa.toLowerCase(), p]))

export function danePostaci(nazwa: string): PostacDane | undefined {
  return WG_NAZWY.get(nazwa.toLowerCase())
}

/** Zdrowie po ludzku: 6 połówek → „3 serca". Postacie bez czerwonych serc (np. Azazel) → 0. */
export function opisZdrowia(hp: number): string {
  if (!hp) return 'brak czerwonych serc'
  const serca = hp / 2
  return serca === 1 ? '1 serce' : `${serca % 1 === 0 ? serca : serca.toFixed(1)} serc`
}

/** Znajdźki na start („3 monety · 1 bomba") — puste, gdy postać nic nie ma. */
export function opisZnajdziek(p: PostacDane): string | null {
  const cz: string[] = []
  if (p.monety) cz.push(`${p.monety} ${p.monety === 1 ? 'moneta' : 'monety'}`)
  if (p.bomby) cz.push(`${p.bomby} ${p.bomby === 1 ? 'bomba' : 'bomby'}`)
  if (p.klucze) cz.push(`${p.klucze} ${p.klucze === 1 ? 'klucz' : 'klucze'}`)
  return cz.length ? cz.join(' · ') : null
}
