// Niedestrukcyjny seed katalogu itemów. W przeciwieństwie do seed.ts NIE czyści
// profilu, marek, achievementów ani runów — tylko upsertuje itemy (po nazwie),
// więc jest bezpieczny do puszczenia na współdzielonym Supabase.
//
// Uruchomienie: pnpm --filter @isaacdex/db db:seed:items
// Dane: items.generated.json (patrz generate-items.mjs).

import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ItemSeed = {
  idW: number
  nazwa: string
  jakosc: number
  typ: 'PASYWNY' | 'AKTYWNY' | 'TRINKET'
  tagi: string[]
}

const ITEMY: ItemSeed[] = JSON.parse(
  readFileSync(new URL('./items.generated.json', import.meta.url), 'utf8'),
)

async function main() {
  // 1. Upsert po unikalnej nazwie — tworzy nowe, aktualizuje istniejące (idW, jakość…).
  let utworzone = 0
  let zaktualizowane = 0
  for (const it of ITEMY) {
    const dane = { idW: it.idW, jakosc: it.jakosc, typ: it.typ, tagi: it.tagi }
    const istnieje = await prisma.item.findUnique({
      where: { nazwa: it.nazwa },
      select: { id: true },
    })
    await prisma.item.upsert({
      where: { nazwa: it.nazwa },
      update: dane,
      create: { nazwa: it.nazwa, ...dane },
    })
    if (istnieje) zaktualizowane++
    else utworzone++
  }

  // 2. Sprzątanie osieroconych itemów spoza katalogu (np. stara nazwa „Sad Onion",
  //    zastąpiona przez „The Sad Onion"). Kasujemy tylko te, których nie używa żaden run
  //    (RunItem→Item to Restrict) — resztę zostawiamy i zgłaszamy.
  const nazwyKatalogu = new Set(ITEMY.map((i) => i.nazwa))
  const wszystkie = await prisma.item.findMany({
    select: { id: true, nazwa: true, _count: { select: { runItemy: true } } },
  })
  const osierocone = wszystkie.filter((i) => !nazwyKatalogu.has(i.nazwa))
  const doUsuniecia = osierocone.filter((i) => i._count.runItemy === 0).map((i) => i.id)
  const zablokowane = osierocone.filter((i) => i._count.runItemy > 0).map((i) => i.nazwa)
  if (doUsuniecia.length) {
    await prisma.item.deleteMany({ where: { id: { in: doUsuniecia } } })
  }

  const razem = await prisma.item.count()
  console.log(`✅ Itemy: +${utworzone} nowych, ${zaktualizowane} zaktualizowanych.`)
  console.log(`🧹 Usunięto osieroconych: ${doUsuniecia.length}.`)
  if (zablokowane.length) {
    console.log(`⚠️ Pominięto (używane w runach): ${zablokowane.join(', ')}`)
  }
  console.log(`📦 Itemów w bazie łącznie: ${razem}.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed itemów nieudany:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
