// Generuje lib/naklejki.json — katalog naklejek czatu (itemy + trinkety + pickupy).
//
// Po co osobny plik, skoro te dane są już w lib/enc/*.json? Bo tamte wiozą OPISY: itemy.json
// to 420 kB cytatów, efektów i pul, potrzebnych Encyklopedii, a naklejce wystarczy nazwa
// i sprite. Import całości do czatu dokładał ~117 kB do bundla /czat — tyle, co druga
// aplikacja. Tu zostaje sam ekstrakt.
//
// Użycie (po zmianie danych w lib/enc/ lub sprite'ów w public/tboi/):
//   node scripts/gen-naklejki.mjs
//
// Format: kategorie → lista [token, nazwa, sciezka]. Krotki, nie obiekty — przy ~950
// wpisach powtórzone klucze („id"/„nazwa"/„src") ważyłyby więcej niż same dane.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const WEB = join(dirname(fileURLToPath(import.meta.url)), '..')
const czytaj = (p) => JSON.parse(readFileSync(join(WEB, p), 'utf8'))

const itemy = czytaj('lib/enc/itemy.json')
const pickupy = czytaj('lib/enc/pickupy.json')
const sprites = czytaj('lib/item-sprites.json')

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Bierzemy tylko wpisy z prawdziwym sprite'em — brak pliku dałby w czacie znak zapytania. */
const maPlik = (src) => existsSync(join(WEB, 'public', src))

const wpisy = (lista, prefiks, byId, katalog) =>
  lista
    .map((i) => {
      const s = byId[String(i.id)]
      return s ? [`${prefiks}${i.id}`, i.nazwa, `/tboi/items/${katalog}/${s}.png`] : null
    })
    .filter((w) => w && maPlik(w[2]))

const katalog = {
  itemy: wpisy(
    itemy.filter((i) => !i.trinket),
    'c',
    sprites.collectibleById,
    'collectibles',
  ),
  trinkety: wpisy(
    itemy.filter((i) => i.trinket),
    't',
    sprites.trinketById,
    'trinkets',
  ),
  pickupy: pickupy
    .filter((p) => p.ikona && maPlik(p.ikona))
    .map((p) => [`p${slug(p.nazwa)}`, p.nazwa, p.ikona]),
}

// Token musi być unikalny w całym katalogu — to on ląduje w treści wiadomości.
const wszystkie = Object.values(katalog).flat()
const tokeny = new Set()
for (const [id] of wszystkie) {
  if (tokeny.has(id)) throw new Error(`Zduplikowany token naklejki: ${id}`)
  tokeny.add(id)
}

writeFileSync(join(WEB, 'lib/naklejki.json'), JSON.stringify(katalog) + '\n')
console.log(
  `naklejki.json: ${wszystkie.length} (itemy ${katalog.itemy.length}, ` +
    `trinkety ${katalog.trinkety.length}, pickupy ${katalog.pickupy.length})`,
)
