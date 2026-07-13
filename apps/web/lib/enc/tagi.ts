/**
 * Tagi itemów pochodzą wprost z plików gry, więc część z nich to opisy mechaniki
 * (`offensive`, `tearsup`, `book`), a część — techniczne flagi pul i wyjątków
 * (`nolostbr`, `lazarusshared`). Te drugie nie mówią graczowi nic sensownego, więc
 * na karcie ich nie pokazujemy; w szczegółach zostają, ale w czytelnej formie.
 */

/** Flagi techniczne — nie trafiają do opisu na karcie. */
const TECHNICZNE = new Set([
  'nolostbr',
  'nocantrip',
  'noeden',
  'nogreed',
  'nochallenge',
  'nodaily',
  'lazarusshared',
  'lazarussharedglobal',
  'uniquefamiliar',
  'nokeeper',
  'norebirth',
])

const ETYKIETY: Record<string, string> = {
  offensive: 'ofensywny',
  summonable: 'przyzywalny',
  tearsup: 'więcej łez',
  monstermanual: 'monster manual',
  baby: 'bobas',
  stars: 'gwiazdy',
  fly: 'mucha',
  spider: 'pająk',
  book: 'książka',
  angel: 'anielski',
  devil: 'diabelski',
  mom: 'mama',
  dead: 'śmierć',
  poop: 'kupa',
  mushroom: 'grzyb',
  syringe: 'strzykawka',
  food: 'jedzenie',
  tech: 'tech',
  guppy: 'guppy',
  battery: 'bateria',
  bob: 'bob',
  quest: 'questowy',
}

/** Tag w czytelnej formie (po polsku, jeśli znamy). */
export function etykietaTagu(tag: string): string {
  return ETYKIETY[tag] ?? tag
}

/** Tagi opisujące mechanikę — bez flag technicznych. */
export function tagiZnaczace(tagi: string[]): string[] {
  return tagi.filter((t) => !TECHNICZNE.has(t))
}

/** Krótki opis na kartę: kilka znaczących tagów, a gdy ich brak — sam typ itemu. */
export function opisItemu(tagi: string[], typ: string): string {
  const znaczace = tagiZnaczace(tagi).slice(0, 3).map(etykietaTagu)
  return znaczace.length ? znaczace.join(' · ') : typ.toLowerCase()
}
