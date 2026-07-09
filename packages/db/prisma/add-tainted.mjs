// Dopisuje splugawione (Tainted) postacie do rostera — BEZ kasowania (upsert).
// Uruchom z załadowanym DATABASE_URL:  node prisma/add-tainted.mjs
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BAZOWE = [
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
]

async function main() {
  const ile = await prisma.postac.count()
  let i = ile // kolejnosc: tainted po bazowych
  for (const base of BAZOWE) {
    const nazwa = `Tainted ${base}`
    await prisma.postac.upsert({
      where: { nazwa },
      update: {},
      create: { nazwa, kolejnosc: i },
    })
    i++
  }
  const total = await prisma.postac.count()
  console.log(`✅ Dopisano tainted. Postaci łącznie: ${total}`)
}

main()
  .catch((e) => {
    console.error('❌', e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
