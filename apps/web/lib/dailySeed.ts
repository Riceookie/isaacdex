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

export type SeedDnia = {
  seed: string
  postac: string
  trudnosc: 'Normal' | 'Hard'
  finishers: number
}

export function seedDnia(data: Date): SeedDnia {
  const dzien = data.toISOString().slice(0, 10)
  const rnd = prng(hash(dzien))
  let kod = ''
  for (let i = 0; i < 8; i++) kod += ALFABET[Math.floor(rnd() * ALFABET.length)]
  const postac = POSTACIE[Math.floor(rnd() * POSTACIE.length)]
  const trudnosc = rnd() < 0.5 ? 'Normal' : 'Hard'
  const finishers = 120 + Math.floor(rnd() * 600)
  return { seed: `${kod.slice(0, 4)} ${kod.slice(4)}`, postac, trudnosc, finishers }
}
