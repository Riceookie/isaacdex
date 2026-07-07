// Seed bazy IsaacDex — dane katalogowe (postacie, itemy) + profil użytkownika.
// Uruchomienie: pnpm --filter @isaacdex/db db:seed   (używa tsx).
//
// Seed jest idempotentny: czyści dane w kolejności zależności, potem tworzy od nowa.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Postacie (kolejność jak na ekranie wyboru).
const POSTACIE = [
  'Isaac', 'Magdalene', 'Cain', 'Judas', '???', 'Eve', 'Samson',
  'Azazel', 'Lazarus', 'Eden', 'The Lost', 'Lilith', 'Keeper',
  'Apollyon', 'The Forgotten', 'Bethany', 'Jacob & Esau',
]

// Starter itemów z jakością 0–4 (rozszerzymy pełną listą w zadaniu 8).
const ITEMY: Array<{ nazwa: string; jakosc: number; typ?: 'PASYWNY' | 'AKTYWNY' | 'TRINKET'; tagi?: string[] }> = [
  { nazwa: 'Sacred Heart', jakosc: 4, tagi: ['dmg up', 'homing', 'tears down'] },
  { nazwa: 'Brimstone', jakosc: 4, tagi: ['dmg up', 'laser'] },
  { nazwa: 'Magic Mushroom', jakosc: 4, tagi: ['dmg up', 'stats up', 'size up'] },
  { nazwa: 'Mom\'s Knife', jakosc: 4, tagi: ['dmg up', 'melee'] },
  { nazwa: 'Polyphemus', jakosc: 3, tagi: ['dmg up', 'tears down'] },
  { nazwa: 'Death\'s Touch', jakosc: 3, tagi: ['dmg up', 'piercing'] },
  { nazwa: 'Dr. Fetus', jakosc: 3, tagi: ['bombs', 'dmg up'] },
  { nazwa: 'The Inner Eye', jakosc: 2, tagi: ['triple shot', 'tears down'] },
  { nazwa: 'Ipecac', jakosc: 2, tagi: ['explosive', 'poison', 'dmg up'] },
  { nazwa: 'Guppy\'s Head', jakosc: 1, typ: 'AKTYWNY', tagi: ['flies', 'guppy'] },
  { nazwa: 'Sad Onion', jakosc: 1, tagi: ['tears up'] },
  { nazwa: 'The Bible', jakosc: 1, typ: 'AKTYWNY', tagi: ['flight', 'pułapka: zabija na Satanie'] },
  { nazwa: 'The Poop', jakosc: 0, typ: 'AKTYWNY', tagi: ['gimmick'] },
  { nazwa: 'Breakfast', jakosc: 0, tagi: ['hp up'] },
]

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
      nazwa: it.nazwa,
      jakosc: it.jakosc,
      typ: it.typ ?? 'PASYWNY',
      tagi: it.tagi ?? [],
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
