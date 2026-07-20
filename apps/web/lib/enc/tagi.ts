/**
 * Tagi itemów pochodzą wprost z plików gry, więc część z nich to opisy mechaniki
 * (`offensive`, `tearsup`, `book`), a część — techniczne flagi pul i wyjątków
 * (`nolostbr`, `lazarusshared`). Te drugie nie mówią graczowi nic sensownego, więc
 * na karcie ich nie pokazujemy; w szczegółach zostają, ale w czytelnej formie.
 */

import type { Klucz, Tlumacz } from '../i18n/slownik'

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

const ETYKIETY: Record<string, Klucz> = {
  offensive: 'encyklopedia.tagOffensive',
  summonable: 'encyklopedia.tagSummonable',
  tearsup: 'encyklopedia.tagTearsup',
  monstermanual: 'encyklopedia.tagMonstermanual',
  baby: 'encyklopedia.tagBaby',
  stars: 'encyklopedia.tagStars',
  fly: 'encyklopedia.tagFly',
  spider: 'encyklopedia.tagSpider',
  book: 'encyklopedia.tagBook',
  angel: 'encyklopedia.tagAngel',
  devil: 'encyklopedia.tagDevil',
  mom: 'encyklopedia.tagMom',
  dead: 'encyklopedia.tagDead',
  poop: 'encyklopedia.tagPoop',
  mushroom: 'encyklopedia.tagMushroom',
  syringe: 'encyklopedia.tagSyringe',
  food: 'encyklopedia.tagFood',
  tech: 'encyklopedia.tagTech',
  guppy: 'encyklopedia.tagGuppy',
  battery: 'encyklopedia.tagBattery',
  bob: 'encyklopedia.tagBob',
  quest: 'encyklopedia.tagQuest',
}

/** Tag w czytelnej formie (przetłumaczony, jeśli go znamy — inaczej surowy z plików gry). */
export function etykietaTagu(tag: string, t: Tlumacz): string {
  const k = ETYKIETY[tag]
  return k ? t(k) : tag
}

/** Tagi opisujące mechanikę — bez flag technicznych. */
export function tagiZnaczace(tagi: string[]): string[] {
  return tagi.filter((t) => !TECHNICZNE.has(t))
}

/** Krótki opis na kartę: kilka znaczących tagów, a gdy ich brak — sam typ itemu. */
export function opisItemu(tagi: string[], typ: string, t: Tlumacz): string {
  const znaczace = tagiZnaczace(tagi)
    .slice(0, 3)
    .map((tag) => etykietaTagu(tag, t))
  return znaczace.length ? znaczace.join(' · ') : typ.toLowerCase()
}
