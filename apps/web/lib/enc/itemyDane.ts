import surowe from './itemy.json'
import type { Klucz, Tlumacz } from '../i18n/slownik'

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

/**
 * Statystyki/efekty z atrybutu `cache` — nazwy z gry mapowane na klucze słownika.
 * Nieznany klucz oddajemy w oryginale: nowa wersja gry doda stata, a to lepsze niż pustka.
 */
const STATY: Record<string, Klucz> = {
  damage: 'encyklopedia.statDamage',
  firedelay: 'encyklopedia.statFiredelay',
  speed: 'encyklopedia.statSpeed',
  range: 'encyklopedia.statRange',
  shotspeed: 'encyklopedia.statShotspeed',
  luck: 'encyklopedia.statLuck',
  tearcolor: 'encyklopedia.statTearcolor',
  tearflag: 'encyklopedia.statTearflag',
  familiars: 'encyklopedia.statFamiliars',
  flying: 'encyklopedia.statFlying',
  weapon: 'encyklopedia.statWeapon',
  size: 'encyklopedia.statSize',
  color: 'encyklopedia.statColor',
  pickupvision: 'encyklopedia.statPickupvision',
  all: 'encyklopedia.statAll',
}

export function etykietaStatu(s: string, t: Tlumacz): string {
  const k = STATY[s]
  return k ? t(k) : s
}

/** Pule itemów (skąd item wypada) — klucze słownika. */
const PULE: Record<string, Klucz> = {
  treasure: 'encyklopedia.pulaTreasure',
  shop: 'encyklopedia.pulaShop',
  boss: 'encyklopedia.pulaBoss',
  devil: 'encyklopedia.pulaDevil',
  angel: 'encyklopedia.pulaAngel',
  secret: 'encyklopedia.pulaSecret',
  ultraSecret: 'encyklopedia.pulaUltraSecret',
  library: 'encyklopedia.pulaLibrary',
  curse: 'encyklopedia.pulaCurse',
  planetarium: 'encyklopedia.pulaPlanetarium',
  goldenChest: 'encyklopedia.pulaGoldenChest',
  redChest: 'encyklopedia.pulaRedChest',
  woodenChest: 'encyklopedia.pulaWoodenChest',
  oldChest: 'encyklopedia.pulaOldChest',
  momsChest: 'encyklopedia.pulaMomsChest',
  beggar: 'encyklopedia.pulaBeggar',
  demonBeggar: 'encyklopedia.pulaDemonBeggar',
  rottenBeggar: 'encyklopedia.pulaRottenBeggar',
  keyMaster: 'encyklopedia.pulaKeyMaster',
  batteryBum: 'encyklopedia.pulaBatteryBum',
  bombBum: 'encyklopedia.pulaBombBum',
  babyShop: 'encyklopedia.pulaBabyShop',
  shellGame: 'encyklopedia.pulaShellGame',
  craneGame: 'encyklopedia.pulaCraneGame',
  greedTreasure: 'encyklopedia.pulaGreedTreasure',
  greedBoss: 'encyklopedia.pulaGreedBoss',
  greedShop: 'encyklopedia.pulaGreedShop',
  greedDevil: 'encyklopedia.pulaGreedDevil',
  greedAngel: 'encyklopedia.pulaGreedAngel',
  greedCurse: 'encyklopedia.pulaGreedCurse',
  greedSecret: 'encyklopedia.pulaGreedSecret',
}

export function etykietaPuli(p: string, t: Tlumacz): string {
  const k = PULE[p]
  return k ? t(k) : p
}
