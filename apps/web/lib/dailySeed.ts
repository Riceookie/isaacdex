// „Seed dnia" — deterministyczny, stabilny w obrębie doby, zmienia się co dzień.
// Wyliczany z daty (YYYY-MM-DD), więc wszyscy widzą ten sam seed danego dnia.

// Alfabet zbliżony do seedów z gry (bez łatwo mylonych znaków jak I/O/U/V).
const ALFABET = 'ABCDEFGHJKLMNPQRSTWXYZ0123456789'
const POSTACIE = [
  'Isaac',
  'Cain',
  'Judas',
  'Azazel',
  'Lilith',
  'The Lost',
  'Samson',
  'Eve',
  'Maggy',
  'Bethany',
  'Jacob',
  'Keeper',
]

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 — mały deterministyczny PRNG z ziarna.
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Dzień jako `YYYY-MM-DD` — wspólny „stempel doby" dla wszystkiego, co ma być stabilne w jej obrębie. */
export function kluczDnia(data: Date): string {
  return data.toISOString().slice(0, 10)
}

/**
 * Deterministyczny wybór elementu z listy na podstawie tekstowego klucza.
 *
 * Istnieje po to, żeby rzeczy „stałe w obrębie doby" (porada dnia maskotki) NIE szły przez
 * `Math.random()`: przy losowaniu każde odświeżenie strony dawałoby inną kwestię i wyglądałoby
 * to na błąd. Ten sam klucz = zawsze ten sam wynik, na każdym renderze i po każdym reloadzie.
 */
export function wybierzZSeeda<T>(lista: readonly T[], klucz: string): T {
  return lista[hash(klucz) % lista.length]
}

export type SeedDnia = {
  seed: string
  postac: string
  trudnosc: 'Normal' | 'Hard'
}

export function seedDnia(data: Date): SeedDnia {
  const rnd = prng(hash(kluczDnia(data)))
  let kod = ''
  for (let i = 0; i < 8; i++) kod += ALFABET[Math.floor(rnd() * ALFABET.length)]
  const postac = POSTACIE[Math.floor(rnd() * POSTACIE.length)]
  const trudnosc = rnd() < 0.5 ? 'Normal' : 'Hard'
  return { seed: `${kod.slice(0, 4)} ${kod.slice(4)}`, postac, trudnosc }
}
