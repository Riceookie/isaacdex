// Kopiuje sprite'y itemów z assetów gry (Repentance+) do public/tboi/items/
// i generuje manifest slug→id (collectibles + trinkets).
//
// Scala DWA źródła: resources/ (baza) + resources-dlc3/ (Repentance+, nadpisuje
// nowszą grafiką i dodaje nowsze itemy). Bez dlc3 brakuje ~170 nowszych itemów.
//
// Użycie:
//   node scripts/copy-item-sprites.mjs "/ścieżka/do/tboi sprites"
// lub przez env TBOI_ROOT. Domyślnie bierze katalog z ~/Downloads.
//
// Slug w nazwie pliku = nazwa.toLowerCase().replace(/[^a-z0-9]/g,'').

import { readdirSync, mkdirSync, copyFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT =
  process.argv[2] || process.env.TBOI_ROOT || join(process.env.HOME || '', 'Downloads/tboi sprites')

// Kolejność ma znaczenie: dlc3 na końcu → nadpisuje bazowe pliki i id.
const ROOTS = ['resources', 'resources-dlc3'].map((r) => join(ROOT, r, 'gfx/items'))
if (!existsSync(ROOTS[0])) {
  console.error(`Nie znaleziono assetów: ${ROOTS[0]}`)
  console.error('Podaj katalog dumpu: node scripts/copy-item-sprites.mjs "<.../tboi sprites>"')
  process.exit(1)
}

const WEB = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEST = join(WEB, 'public/tboi/items')

const KINDS = [
  { dir: 'collectibles', kind: 'collectible', re: /^collectibles_(\d+)_(.+)\.png$/ },
  { dir: 'trinkets', kind: 'trinket', re: /^trinket_(\d+)_(.+)\.png$/ },
]

// slug→id (po nazwie) oraz id→slug (po id gry). Ten drugi jest głównym trybem
// dobierania sprite'a w aplikacji (Item.idW). Różne id mogą dzielić slug (np.
// dwa warianty „Jacob's Ladder"), dlatego id→slug budujemy dla KAŻDEGO pliku.
const manifest = { collectible: {}, trinket: {}, collectibleById: {}, trinketById: {} }
const byIdKey = { collectible: 'collectibleById', trinket: 'trinketById' }
let copied = 0

for (const { dir, kind, re } of KINDS) {
  const to = join(DEST, dir)
  mkdirSync(to, { recursive: true })
  for (const src of ROOTS) {
    const from = join(src, dir)
    if (!existsSync(from)) continue
    for (const f of readdirSync(from)) {
      const m = re.exec(f)
      if (!m) continue // pomija questionmark.png i inne bez id
      const [, id, slug] = m
      manifest[kind][slug] = Number(id) // dlc3 nadpisuje bazowe
      manifest[byIdKey[kind]][Number(id)] = slug
      copyFileSync(join(from, f), join(to, `${slug}.png`))
      copied++
    }
  }
}

copyFileSync(join(ROOTS[0], 'collectibles', 'questionmark.png'), join(DEST, 'questionmark.png'))
writeFileSync(join(DEST, 'manifest.json'), JSON.stringify(manifest) + '\n')
writeFileSync(join(WEB, 'lib/item-sprites.json'), JSON.stringify(manifest) + '\n')

console.log(`Skopiowano/nadpisano ${copied} plików (z ${ROOTS.length} źródeł).`)
console.log(
  `collectibles: ${Object.keys(manifest.collectible).length}, trinkets: ${Object.keys(manifest.trinket).length}`,
)
