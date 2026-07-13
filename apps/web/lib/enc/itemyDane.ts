import surowe from './itemy.json'

/**
 * Dane itemów wyciągnięte z plików gry (items.xml, items_metadata.xml, itempools.xml,
 * achievements.xml, stringtable.sta) i uzupełnione opisem efektu + warunkiem odblokowania
 * z wiki. Baza (tabela Item) zostaje źródłem listy i jakości — to jest warstwa opisowa.
 */
export type ItemDane = {
  id: number
  nazwa: string
  typ: string
  cytat?: string // krótki tekst z gry („Blood laser barrage")
  opis?: string // pełny opis efektu (wiki)
  jakosc?: number
  ladunek?: number // ładunek itemu aktywnego
  staty?: string[] // co zmienia (atrybut `cache` z items.xml)
  pule?: string[] // w jakich pulach się pojawia
  achievement?: string // nazwa achievementu odblokowującego
  warunek?: string // jak go zdobyć (wiki)
  trinket?: boolean
  familiar?: boolean
  wyglad?: boolean // jest obrazek Isaaca z tym itemem (public/tboi/items/wyglad/<id>.png)
  lzy?: boolean // jest obrazek efektu łez (public/tboi/items/lzy/<id>.png)
}

/** Obrazki „Wygląd" pobrane z wiki — Isaac w kostiumie itemu i efekt łez. */
export function obrazekWygladu(d: ItemDane | undefined): string | undefined {
  return d?.wyglad ? `/tboi/items/wyglad/${d.id}.png` : undefined
}
export function obrazekLez(d: ItemDane | undefined): string | undefined {
  return d?.lzy ? `/tboi/items/lzy/${d.id}.png` : undefined
}

const DANE = surowe as ItemDane[]

// UWAGA: id kolekcjonerskie i id trinketu to OSOBNE numeracje — collectible #118 to Brimstone,
// a trinket #118 to Bat Wing. Trzymamy więc dwie mapy, inaczej trinkety nadpisują itemy.
const KOLEKCJONERSKIE = DANE.filter((i) => !i.trinket)
export const TRINKETY = DANE.filter((i) => i.trinket)

const WG_ID = new Map<number, ItemDane>(KOLEKCJONERSKIE.map((i) => [i.id, i]))
const WG_NAZWY = new Map<string, ItemDane>(KOLEKCJONERSKIE.map((i) => [i.nazwa.toLowerCase(), i]))

/** Dane opisowe itemu kolekcjonerskiego — po id z gry, a gdy brak, po nazwie. */
export function daneItemu(idW: number | null | undefined, nazwa: string): ItemDane | undefined {
  return (idW != null ? WG_ID.get(idW) : undefined) ?? WG_NAZWY.get(nazwa.toLowerCase())
}

/** Statystyki/efekty z atrybutu `cache` — po polsku. */
const STATY: Record<string, string> = {
  damage: 'Obrażenia',
  firedelay: 'Szybkostrzelność',
  speed: 'Szybkość',
  range: 'Zasięg',
  shotspeed: 'Prędkość łez',
  luck: 'Szczęście',
  tearcolor: 'Kolor łez',
  tearflag: 'Efekt łez',
  familiars: 'Chowańce',
  flying: 'Latanie',
  weapon: 'Zmienia broń',
  size: 'Rozmiar postaci',
  color: 'Wygląd postaci',
  pickupvision: 'Podgląd znajdziek',
  all: 'Wszystkie statystyki',
}

export function etykietaStatu(s: string): string {
  return STATY[s] ?? s
}

/** Pule itemów (skąd item wypada) — po polsku. */
const PULE: Record<string, string> = {
  treasure: 'Skarbiec',
  shop: 'Sklep',
  boss: 'Boss',
  devil: 'Diabelski pokój',
  angel: 'Anielski pokój',
  secret: 'Sekretny pokój',
  ultraSecret: 'Ultra sekretny pokój',
  library: 'Biblioteka',
  curse: 'Przeklęty pokój',
  planetarium: 'Planetarium',
  goldenChest: 'Złota skrzynia',
  redChest: 'Czerwona skrzynia',
  woodenChest: 'Drewniana skrzynia',
  oldChest: 'Stara skrzynia',
  momsChest: 'Skrzynia mamy',
  beggar: 'Żebrak',
  demonBeggar: 'Demon-żebrak',
  rottenBeggar: 'Zgniły żebrak',
  keyMaster: 'Klucznik',
  batteryBum: 'Bum od baterii',
  bombBum: 'Bum od bomb',
  babyShop: 'Sklep z bobasami',
  shellGame: 'Gra w kubki',
  craneGame: 'Automat z pluszakami',
  greedTreasure: 'Greed — skarbiec',
  greedBoss: 'Greed — boss',
  greedShop: 'Greed — sklep',
  greedDevil: 'Greed — diabelski',
  greedAngel: 'Greed — anielski',
  greedCurse: 'Greed — przeklęty',
  greedSecret: 'Greed — sekretny',
}

export function etykietaPuli(p: string): string {
  return PULE[p] ?? p
}
