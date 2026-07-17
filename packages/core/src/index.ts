// packages/core — logika biznesowa IsaacDex ("serce aplikacji", zadanie 4).
//
// Czyste, testowalne funkcje (bez dostępu do bazy). Dane dostarcza warstwa wyżej
// (apps/api czyta je z Prisma), a tu podejmujemy decyzje wg reguł biznesowych.

/** Jakość itemu w The Binding of Isaac: 0 (najsłabszy) – 4 (najlepszy). */
export type Jakosc = 0 | 1 | 2 | 3 | 4

export type Rekomendacja = 'BIERZ' | 'ZWYKLE_WARTO' | 'SYTUACYJNIE' | 'RACZEJ_POMIN' | 'UWAGA'

export type ItemDoOceny = {
  nazwa: string
  jakosc: Jakosc
  tagi: string[]
}

/** Kontekst runu, który może zmienić rekomendację (np. z jakim bossem walczysz). */
export type KontekstRunu = {
  przeciwBossowi?: string
  /** Itemy, które Isaac już ma w tym runie — pozwala wykrywać synergie. */
  posiadaneItemy?: string[]
}

export type OcenaItemu = {
  rekomendacja: Rekomendacja
  powody: string[]
  /** Rekomendacja wynikająca z samej jakości, przed nałożeniem reguł (przejrzystość dla UI). */
  bazowa?: Rekomendacja
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

/** Podnosi rekomendację o jeden krok (nigdy powyżej BIERZ). */
function oJedenWyzej(rek: Rekomendacja): Rekomendacja {
  const kolejnosc: Rekomendacja[] = [
    'UWAGA',
    'RACZEJ_POMIN',
    'SYTUACYJNIE',
    'ZWYKLE_WARTO',
    'BIERZ',
  ]
  const i = kolejnosc.indexOf(rek)
  return kolejnosc[Math.min(i + 1, kolejnosc.length - 1)]
}

/** Zwraca wartość po dwukropku (lowercase) dla tagu z prefiksem, np. "pułapka-boss:SATAN" → "satan". */
function wartoscTagu(tag: string, prefiks: string): string | null {
  const low = tag.toLowerCase()
  return low.startsWith(prefiks) ? low.slice(prefiks.length).trim() : null
}

/**
 * Doradca „brać czy zostawić". Bazuje na jakości (0–4), a potem nakłada reguły w kolejności:
 * najpierw plusy sytuacyjne (podnoszą — synergie, dobre matchupy), potem pułapki (obniżają).
 * Dzięki tej kolejności **pułapka zawsze wygrywa z synergią** — bezpieczeństwo ponad okazją.
 *
 * Reguły są sterowane danymi (tagi itemu), więc obsługa kolejnych bossów/synergii = dopisanie tagu:
 *   - `pułapka` / `pułapka-boss:<BOSS>` — item niebezpieczny (ogólnie lub przy danym bossie),
 *   - `mocny-boss:<BOSS>`              — świetny matchup na danego bossa (plus sytuacyjny),
 *   - `synergia:<ITEM>`               — łączy się z posiadanym itemem (plus sytuacyjny).
 */
export function ocenItem(item: ItemDoOceny, kontekst: KontekstRunu = {}): OcenaItemu {
  const baza = WG_JAKOSCI[item.jakosc]
  let rek: Rekomendacja = baza.rek
  const powody: string[] = [baza.powod]
  const boss = kontekst.przeciwBossowi
  const posiadane = (kontekst.posiadaneItemy ?? []).map((n) => n.toLowerCase())
  const tagi = item.tagi.map((t) => t.trim())

  const podnies = (powod: string) => {
    powody.push(powod)
    rek = oJedenWyzej(rek)
  }
  const rozwaz = (kandydat: Rekomendacja, powod: string) => {
    powody.push(powod)
    if (WAGA[kandydat] < WAGA[rek]) rek = kandydat
  }

  // Plusy sytuacyjne (najpierw — pułapki mogą je potem obniżyć).
  // Reguła A: dobry matchup na konkretnego bossa — tag "mocny-boss:<BOSS>".
  for (const t of tagi) {
    const b = wartoscTagu(t, 'mocny-boss:')
    if (b && boss && b === boss.toLowerCase()) podnies(`✅ Świetny na ${boss} — warto wziąć tutaj.`)
  }
  // Reguła B: synergia z posiadanym itemem — tag "synergia:<ITEM>".
  for (const t of tagi) {
    const inny = wartoscTagu(t, 'synergia:')
    if (inny && posiadane.includes(inny)) podnies(`✅ Synergia z „${inny}", którego już masz.`)
  }

  // Pułapki (na końcu — zawsze wygrywają z plusami).
  // Reguła C: ogólna pułapka oznaczona w tagach (np. "pułapka" lub "pułapka: zabija na Satanie").
  // Pomijamy formę "pułapka-boss:<BOSS>", którą obsługuje osobno reguła D (zależna od kontekstu).
  for (const t of tagi) {
    const low = t.toLowerCase()
    if (low.includes('pułapka') && !low.startsWith('pułapka-boss:')) rozwaz('UWAGA', `⚠️ ${t}`)
  }
  // Reguła D: pułapka zależna od bossa — tag "pułapka-boss:<BOSS>".
  for (const t of tagi) {
    const b = wartoscTagu(t, 'pułapka-boss:')
    if (b && boss && b === boss.toLowerCase()) rozwaz('UWAGA', `⚠️ Pułapka przeciw ${boss}.`)
  }
  // Reguła E: kontekst wbudowany — The Bible przed walką z Satanem = pewna śmierć.
  if (boss === 'SATAN' && item.nazwa.toLowerCase().includes('bible')) {
    rozwaz('UWAGA', '⚠️ Nie bierz przed Satanem — The Bible zabija Isaaca na Satanie.')
  }

  return { rekomendacja: rek, powody, bazowa: baza.rek }
}

/**
 * Procent ukończenia = odblokowane / wszystkie (0–100, zaokrąglony).
 * Twardo ograniczony do [0, 100] — gdy dane mają więcej zaliczonych marek niż zakłada
 * mianownik (np. marki NORMAL+HARD przy mianowniku „jedna na bossa"), procent nie ucieka nad 100.
 */
export function procentUkonczenia(odblokowane: number, wszystkie: number): number {
  if (wszystkie <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((odblokowane / wszystkie) * 100)))
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

export type MarkaWejscie = { boss: string; tryb: 'NORMAL' | 'HARD'; zaliczone: boolean }

export type PodsumowanieMarek = {
  normalZaliczone: number
  hardZaliczone: number
  wszystkieMarki: number
  procent: number
  deadGod: boolean
}

/**
 * Podsumowuje completion marki postaci. Każdy boss ma dwie marki (NORMAL + HARD),
 * więc komplet to `liczbaBossow * 2`. `deadGod` = wszystkie marki zaliczone (ekran „Dead God").
 * Procent liczy przez reużycie `procentUkonczenia`.
 */
export function podsumujMarki(marki: MarkaWejscie[], liczbaBossow: number): PodsumowanieMarek {
  const normalZaliczone = marki.filter((m) => m.tryb === 'NORMAL' && m.zaliczone).length
  const hardZaliczone = marki.filter((m) => m.tryb === 'HARD' && m.zaliczone).length
  const wszystkieMarki = Math.max(0, liczbaBossow) * 2
  const zaliczone = normalZaliczone + hardZaliczone
  return {
    normalZaliczone,
    hardZaliczone,
    wszystkieMarki,
    procent: procentUkonczenia(zaliczone, wszystkieMarki),
    deadGod: wszystkieMarki > 0 && zaliczone >= wszystkieMarki,
  }
}

export type KlasaRzadkosci = 'LEGENDARNY' | 'RZADKI' | 'POSPOLITY'

/**
 * Klasa rzadkości achievementu wg globalnego % graczy, którzy go odblokowali.
 * Progi spójne z UI (<5% = legendarny/„złota ramka", <20% = rzadki). Brak danych → POSPOLITY.
 */
export function klasaRzadkosci(globalnyProcent: number | null | undefined): KlasaRzadkosci {
  if (globalnyProcent == null) return 'POSPOLITY'
  if (globalnyProcent < 5) return 'LEGENDARNY'
  if (globalnyProcent < 20) return 'RZADKI'
  return 'POSPOLITY'
}

// ─────────────────────────────────────────────────────────────────────────────
// Kalkulator statystyk
// ─────────────────────────────────────────────────────────────────────────────

/** Siedem statystyk gracza (te, które gra pokazuje na ekranie postaci). */
export type Stat = 'damage' | 'tears' | 'speed' | 'range' | 'shotSpeed' | 'luck'

export type StatyBazowe = {
  damage: number
  /** Mnożnik obrażeń postaci (np. Judas ×1.35) — nakładany PO dodatkach z itemów. */
  damageMult: number
  tears: number
  speed: number
  range: number
  shotSpeed: number
  luck: number
}

/** Wpływ itemu na statystyki: płaskie dodatki i mnożniki. */
export type ModyfikatorStatow = {
  plaskie?: Partial<Record<Stat, number>>
  mnozniki?: Partial<Record<Stat, number>>
}

export type WynikStatow = Record<Stat, number>

/** Limity gry — bez nich item „+50 speed" dałby bzdurę. */
const LIMITY: Record<Stat, { min: number; max: number }> = {
  damage: { min: 0, max: 999 },
  tears: { min: 0.35, max: 25 },
  speed: { min: 0.1, max: 2 },
  range: { min: 1, max: 30 },
  shotSpeed: { min: 0.6, max: 5 },
  luck: { min: -20, max: 40 },
}

const STATY: Stat[] = ['damage', 'tears', 'speed', 'range', 'shotSpeed', 'luck']

/**
 * Statystyki po wzięciu itemów. Kolejność jak w grze: najpierw sumujemy płaskie dodatki,
 * potem nakładamy mnożniki (itemów i postaci), na końcu przycinamy do limitów gry.
 */
export function policzStaty(baza: StatyBazowe, itemy: ModyfikatorStatow[]): WynikStatow {
  const wynik = {} as WynikStatow

  for (const stat of STATY) {
    const plaskie = itemy.reduce((s, i) => s + (i.plaskie?.[stat] ?? 0), 0)
    const mnoznik = itemy.reduce((m, i) => m * (i.mnozniki?.[stat] ?? 1), 1)
    // Mnożnik obrażeń postaci (Judas, ???) działa tak samo jak mnożnik z itemu.
    const mnoznikPostaci = stat === 'damage' ? baza.damageMult : 1

    const surowy = (baza[stat] + plaskie) * mnoznik * mnoznikPostaci
    const { min, max } = LIMITY[stat]
    wynik[stat] = Math.round(Math.min(max, Math.max(min, surowy)) * 100) / 100
  }

  return wynik
}

/** Staty samej postaci (bez itemów) — do kolumny „Baza". */
export function statyBazowe(baza: StatyBazowe): WynikStatow {
  return policzStaty(baza, [])
}
