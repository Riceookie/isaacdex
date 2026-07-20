import surowe from './naklejki.json'

/**
 * Katalog naklejek czatu: KOMPLET itemów, trinketów i pickupów z gry (958 sztuk).
 *
 * Dane idą z wygenerowanego `naklejki.json` (skrypt `scripts/gen-naklejki.mjs`), a NIE
 * wprost z `lib/enc/*` — tamte pliki wiozą opisy, cytaty i pule dla Encyklopedii i dokładały
 * ~117 kB do bundla czatu. Naklejce wystarczy nazwa i ścieżka sprite'a.
 *
 * Po dodaniu itemu do `lib/enc/itemy.json` (albo nowych sprite'ów) przepuść skrypt jeszcze
 * raz — inaczej nowość nie pojawi się wśród naklejek.
 */

export type KatNaklejki = 'itemy' | 'trinkety' | 'pickupy'

export type Naklejka = {
  /** Token wstawiany w treść wiadomości (`:c105:`). */
  id: string
  nazwa: string
  src: string
  kat: KatNaklejki
}

/**
 * Token naklejki: `c<id>` item kolekcjonerski, `t<id>` trinket, `p<slug>` pickup.
 *
 * Itemy i trinkety idą po ID Z GRY, nie po nazwie — nazwa bywa poprawiana (literówka,
 * tłumaczenie), a wtedy naklejki wysłane wcześniej przestałyby się renderować. ID jest stałe.
 * Prefiks `c`/`t` jest konieczny, bo obie numeracje zaczynają się od 1 i na siebie zachodzą
 * (collectible #118 to Brimstone, trinket #118 to Bat Wing).
 *
 * Pickupy nie mają ID w danych, więc lecą po slugu nazwy — ten się nie zmienia.
 */
type Krotka = [id: string, nazwa: string, src: string]

const DANE = surowe as Record<KatNaklejki, Krotka[]>

export const KATEGORIE: { id: KatNaklejki; label: string }[] = [
  { id: 'itemy', label: 'Itemy' },
  { id: 'trinkety', label: 'Trinkety' },
  { id: 'pickupy', label: 'Pickupy' },
]

const wKategorii = (kat: KatNaklejki): Naklejka[] =>
  DANE[kat].map(([id, nazwa, src]) => ({ id, nazwa, src, kat }))

/** Wszystkie naklejki, w kolejności kategorii. */
export const NAKLEJKI: Naklejka[] = KATEGORIE.flatMap((k) => wKategorii(k.id))

const WG_ID = new Map(NAKLEJKI.map((n) => [n.id, n]))

/** Naklejka po tokenie — `undefined`, gdy token nic nie znaczy (zostanie tekstem). */
export function naklejka(id: string): Naklejka | undefined {
  return WG_ID.get(id)
}

/** Naklejki kategorii, przefiltrowane frazą z szukajki (po nazwie itemu). */
export function szukaj(kat: KatNaklejki, fraza: string): Naklejka[] {
  const f = fraza.trim().toLowerCase()
  return NAKLEJKI.filter((n) => n.kat === kat && (!f || n.nazwa.toLowerCase().includes(f)))
}
