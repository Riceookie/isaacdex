// packages/core — logika biznesowa IsaacDex ("serce aplikacji", zadanie 4).
//
// Czyste, testowalne funkcje (bez dostępu do bazy). Dane dostarcza warstwa wyżej
// (apps/api czyta je z Prisma), a tu podejmujemy decyzje wg reguł biznesowych.

/** Jakość itemu w The Binding of Isaac: 0 (najsłabszy) – 4 (najlepszy). */
export type Jakosc = 0 | 1 | 2 | 3 | 4

export type Rekomendacja =
  | 'BIERZ'
  | 'ZWYKLE_WARTO'
  | 'SYTUACYJNIE'
  | 'RACZEJ_POMIN'
  | 'UWAGA'

export type ItemDoOceny = {
  nazwa: string
  jakosc: Jakosc
  tagi: string[]
}

/** Kontekst runu, który może zmienić rekomendację (np. z jakim bossem walczysz). */
export type KontekstRunu = {
  przeciwBossowi?: string
}

export type OcenaItemu = {
  rekomendacja: Rekomendacja
  powody: string[]
}

const WG_JAKOSCI: Record<Jakosc, { rek: Rekomendacja; powod: string }> = {
  4: { rek: 'BIERZ', powod: 'Jakość 4 — prawie zawsze wzmacnia run.' },
  3: { rek: 'ZWYKLE_WARTO', powod: 'Jakość 3 — solidny item, zwykle warto.' },
  2: { rek: 'SYTUACYJNIE', powod: 'Jakość 2 — zależy od buildu.' },
  1: { rek: 'RACZEJ_POMIN', powod: 'Jakość 1 — słaby, bierz gdy pusto.' },
  0: { rek: 'UWAGA', powod: 'Jakość 0 — może rozwodnić pulę lub zepsuć run.' },
}

// Waga rekomendacji — pozwala wybrać „gorszą" (bardziej ostrożną) po zastosowaniu reguł.
const WAGA: Record<Rekomendacja, number> = {
  BIERZ: 4,
  ZWYKLE_WARTO: 3,
  SYTUACYJNIE: 2,
  RACZEJ_POMIN: 1,
  UWAGA: 0,
}

/**
 * Doradca „brać czy zostawić". Bazuje na jakości (0–4), a potem nakłada reguły:
 * pułapki oznaczone w tagach oraz reguły kontekstowe (np. The Bible na Satanie).
 * Wynikowa rekomendacja jest najbardziej ostrożną z wyliczonych.
 */
export function ocenItem(item: ItemDoOceny, kontekst: KontekstRunu = {}): OcenaItemu {
  const baza = WG_JAKOSCI[item.jakosc]
  let rek: Rekomendacja = baza.rek
  const powody: string[] = [baza.powod]

  const rozwaz = (kandydat: Rekomendacja, powod: string) => {
    powody.push(powod)
    if (WAGA[kandydat] < WAGA[rek]) rek = kandydat
  }

  // Reguła 1: pułapki oznaczone w tagach (np. "pułapka: zabija na Satanie").
  const pulapki = item.tagi.filter((t) => t.toLowerCase().includes('pułapka'))
  for (const p of pulapki) rozwaz('UWAGA', `⚠️ ${p}`)

  // Reguła 2: kontekst — The Bible przed walką z Satanem = pewna śmierć.
  if (kontekst.przeciwBossowi === 'SATAN' && item.nazwa.toLowerCase().includes('bible')) {
    rozwaz('UWAGA', '⚠️ Nie bierz przed Satanem — The Bible zabija Isaaca na Satanie.')
  }

  return { rekomendacja: rek, powody }
}

/** Procent ukończenia = odblokowane / wszystkie (0–100, zaokrąglony). */
export function procentUkonczenia(odblokowane: number, wszystkie: number): number {
  if (wszystkie <= 0) return 0
  return Math.round((odblokowane / wszystkie) * 100)
}

/**
 * Reguła kolejności: mark na HARD można zaznaczyć dopiero, gdy NORMAL jest zaliczony.
 * (Nasza reguła biznesowa — wymusza sensowną kolejność postępu.)
 */
export function sprawdzReguleHard(
  tryb: 'NORMAL' | 'HARD',
  normalZaliczony: boolean,
): { ok: boolean; powod?: string } {
  if (tryb === 'HARD' && !normalZaliczony) {
    return { ok: false, powod: 'Najpierw zalicz tego bossa na NORMAL, dopiero potem HARD.' }
  }
  return { ok: true }
}
