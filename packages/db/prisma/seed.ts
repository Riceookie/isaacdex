// Seed bazy IsaacDex — dane katalogowe (postacie, itemy) + profil użytkownika.
// Uruchomienie: pnpm --filter @isaacdex/db db:seed   (używa tsx).
//
// Seed jest idempotentny: czyści dane w kolejności zależności, potem tworzy od nowa.

import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Postacie (kolejność jak na ekranie wyboru).
const POSTACIE = [
  'Isaac',
  'Magdalene',
  'Cain',
  'Judas',
  '???',
  'Eve',
  'Samson',
  'Azazel',
  'Lazarus',
  'Eden',
  'The Lost',
  'Lilith',
  'Keeper',
  'Apollyon',
  'The Forgotten',
  'Bethany',
  'Jacob & Esau',
  // Splugawione (Repentance) — po bazowych.
  'Tainted Isaac',
  'Tainted Magdalene',
  'Tainted Cain',
  'Tainted Judas',
  'Tainted ???',
  'Tainted Eve',
  'Tainted Samson',
  'Tainted Azazel',
  'Tainted Lazarus',
  'Tainted Eden',
  'Tainted The Lost',
  'Tainted Lilith',
  'Tainted Keeper',
  'Tainted Apollyon',
  'Tainted The Forgotten',
  'Tainted Bethany',
  'Tainted Jacob & Esau',
]

// Pełny katalog collectibles (id, nazwa, jakość 0–4, typ, tagi) wygenerowany
// z assetów gry Repentance+ przez prisma/generate-items.mjs. Trinkety pominięte:
// gra nie nadaje im oceny jakości, więc doradca „brać/zostawić" nie miałby ich jak ocenić.
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
  // 1. Czyszczenie (od "liści" do "korzeni").
  await prisma.runItem.deleteMany()
  await prisma.run.deleteMany()
  await prisma.completionMark.deleteMany()
  await prisma.steamAchievement.deleteMany()
  await prisma.item.deleteMany()
  await prisma.postac.deleteMany()
  await prisma.profil.deleteMany()

  // 2. Postacie
  await prisma.postac.createMany({
    data: POSTACIE.map((nazwa, i) => ({ nazwa, kolejnosc: i })),
  })

  // 3. Itemy
  await prisma.item.createMany({
    data: ITEMY.map((it) => ({
      idW: it.idW,
      nazwa: it.nazwa,
      jakosc: it.jakosc,
      typ: it.typ,
      tagi: it.tagi,
    })),
  })

  // 4. Profil użytkownika (Twoje konto Steam)
  await prisma.profil.create({
    data: { steamId64: '76561198990473445', nick: 'Ananas' },
  })

  const [postacie, itemy, profile] = await Promise.all([
    prisma.postac.count(),
    prisma.item.count(),
    prisma.profil.count(),
  ])
  console.log(`✅ Seed gotowy: ${postacie} postaci, ${itemy} itemów, ${profile} profil.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed nieudany:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
