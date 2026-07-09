// Generuje katalog itemów (collectibles) z assetów gry (Repentance+) do
// items.generated.json — źródło dla seed.ts. Trinkety pomijamy: gra nie nadaje
// im oceny jakości (w items_metadata.xml wszystkie mają quality="0"), więc nie
// dałoby się ich sensownie ocenić w doradcy „brać/zostawić".
//
// Użycie:
//   node prisma/generate-items.mjs "/ścieżka/do/resources-dlc3" "/ścieżka/do/resources/stringtable.sta"
// lub przez env TBOI_RES_DIR / TBOI_STA. Domyślnie bierze z ~/Downloads.
//
// Nazwy itemów pochodzą z angielskiej kolumny stringtable.sta (pierwszy <string>).
// Jakość i tagi z items_metadata.xml; typ (passive/active/familiar) z items.xml.

import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOME = process.env.HOME || ''
const RES =
  process.argv[2] || process.env.TBOI_RES_DIR || join(HOME, 'Downloads/tboi sprites/resources-dlc3')
const STA =
  process.argv[3] ||
  process.env.TBOI_STA ||
  join(HOME, 'Downloads/tboi sprites/resources/stringtable.sta')

// Kuratorskie tagi doradcy z pierwotnego seedu — dopisowe + reguły (np. pułapka
// Bible). Dołączamy je do tagów z gry, żeby reguły ocenItem dalej działały.
const OVERRIDES = {
  'The Bible': ['pułapka: zabija na Satanie'],
}

// 1) stringtable: key -> angielska nazwa (pierwszy <string>)
const names = new Map()
{
  const sta = readFileSync(STA, 'utf8')
  const re = /<key name="([^"]+)">\s*<string>([\s\S]*?)<\/string>/g
  let m
  while ((m = re.exec(sta))) names.set(m[1], m[2])
}

// 2) items_metadata: id -> {quality, tags}
const metaItem = new Map()
{
  const meta = readFileSync(join(RES, 'items_metadata.xml'), 'utf8')
  const re = /<item\s+id="(\d+)"([^>]*)\/>/g
  let m
  while ((m = re.exec(meta))) {
    const q = /quality="(-?\d+)"/.exec(m[2])
    const t = /tags="([^"]*)"/.exec(m[2])
    metaItem.set(Number(m[1]), {
      quality: q ? Number(q[1]) : null,
      tags: t && t[1].trim() ? t[1].trim().split(/\s+/) : [],
    })
  }
}

// 3) items.xml: collectibles (passive/active/familiar)
const TYP = { passive: 'PASYWNY', familiar: 'PASYWNY', active: 'AKTYWNY' }
const collectibles = []
{
  const items = readFileSync(join(RES, 'items.xml'), 'utf8')
  for (const tag of ['passive', 'active', 'familiar']) {
    const re = new RegExp(`<${tag}\\s+([^>]*?)/>`, 'g')
    let m
    while ((m = re.exec(items))) {
      const id = /\bid="(\d+)"/.exec(m[1])
      const name = /\bname="([^"]*)"/.exec(m[1])
      if (!id || !name) continue
      collectibles.push({ id: Number(id[1]), nameRef: name[1], typ: TYP[tag] })
    }
  }
}

// 4) join + filtr + dedupe (nazwa jest @unique)
const seen = new Set()
const rows = []
const skipped = []
const dups = []
for (const e of collectibles.sort((a, b) => a.id - b.id)) {
  const nazwa = e.nameRef.startsWith('#') ? names.get(e.nameRef.slice(1)) : e.nameRef
  const md = metaItem.get(e.id) || { quality: null, tags: [] }
  if (!nazwa) {
    skipped.push({ id: e.id, ref: e.nameRef, why: 'brak nazwy w stringtable' })
    continue
  }
  if (md.quality == null || md.quality < 0 || md.quality > 4) {
    skipped.push({ id: e.id, nazwa, why: `quality=${md.quality}` })
    continue
  }
  if (seen.has(nazwa)) {
    dups.push({ id: e.id, nazwa })
    continue
  }
  seen.add(nazwa)
  const tagi = [...md.tags, ...(OVERRIDES[nazwa] || [])]
  rows.push({ idW: e.id, nazwa, jakosc: md.quality, typ: e.typ, tagi })
}

const outPath = join(dirname(fileURLToPath(import.meta.url)), 'items.generated.json')
writeFileSync(outPath, JSON.stringify(rows, null, 0) + '\n')

console.log(`Wygenerowano ${rows.length} collectibles → ${outPath}`)
console.log(
  `Pominięte (dummy/bez jakości): ${skipped.length}`,
  skipped.map((s) => s.nazwa || s.ref),
)
console.log(
  `Duplikaty nazw (pominięte): ${dups.length}`,
  dups.map((d) => `${d.nazwa}#${d.id}`),
)
const qd = {}
for (const r of rows) qd[r.jakosc] = (qd[r.jakosc] || 0) + 1
console.log('Rozkład jakości:', qd)
