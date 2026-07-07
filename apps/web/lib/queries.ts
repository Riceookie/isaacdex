// Dostęp do danych dla frontendu (server-side). Reużywa Prisma (@isaacdex/db)
// i logikę (@isaacdex/core) — ten sam kod co backend, bez duplikacji reguł.
import { prisma, BossKoncowy, TrybGry } from '@isaacdex/db'
import { procentUkonczenia } from '@isaacdex/core'

export const LICZBA_BOSSOW = Object.keys(BossKoncowy).length
export const LICZBA_TRYBOW = Object.keys(TrybGry).length
export const MARK_NA_POSTAC = LICZBA_BOSSOW * LICZBA_TRYBOW

export async function getDashboard() {
  // Niezależne zapytania równolegle (mniej round-tripów do bazy).
  const [profil, postacie] = await Promise.all([
    prisma.profil.findFirst(),
    prisma.postac.findMany({ orderBy: { kolejnosc: 'asc' } }),
  ])

  const grouped = profil
    ? await prisma.completionMark.groupBy({
        by: ['postacId'],
        where: { profilId: profil.id, zaliczone: true },
        _count: { _all: true },
      })
    : []
  const perPostac = new Map(grouped.map((g) => [g.postacId, g._count._all]))

  const lista = postacie.map((p) => {
    const zal = perPostac.get(p.id) ?? 0
    return { nazwa: p.nazwa, zaliczone: zal, procent: procentUkonczenia(zal, MARK_NA_POSTAC) }
  })
  const sumZal = lista.reduce((s, p) => s + p.zaliczone, 0)
  const total = postacie.length * MARK_NA_POSTAC

  return {
    profil,
    postacie: lista,
    overall: {
      zaliczone: sumZal,
      wszystkie: total,
      procent: procentUkonczenia(sumZal, total),
    },
  }
}

export async function getPostacMarks(nazwa: string) {
  const postac = await prisma.postac.findUnique({ where: { nazwa } })
  if (!postac) return null
  const profil = await prisma.profil.findFirst()
  const marks = profil
    ? await prisma.completionMark.findMany({
        where: { profilId: profil.id, postacId: postac.id },
      })
    : []
  const zaznaczone = marks.filter((m) => m.zaliczone).map((m) => `${m.boss}:${m.tryb}`)
  return {
    postac: postac.nazwa,
    bossy: Object.values(BossKoncowy) as string[],
    tryby: Object.values(TrybGry) as string[],
    zaznaczone,
  }
}

export async function getKolekcja() {
  const profil = await prisma.profil.findFirst()
  if (!profil) return { achievements: [] }
  const a = await prisma.steamAchievement.findMany({
    where: { profilId: profil.id },
    orderBy: [{ odblokowany: 'desc' }, { globalnyProcent: 'asc' }],
  })
  const achievements = a.map((x) => ({
    apiName: x.apiName,
    nazwa: x.nazwa,
    opis: x.opis,
    ikonaUrl: x.ikonaUrl,
    globalnyProcent: x.globalnyProcent != null ? Number(x.globalnyProcent) : null,
    odblokowany: x.odblokowany,
    dataOdblokowania: x.dataOdblokowania ? x.dataOdblokowania.toISOString() : null,
  }))
  return { achievements }
}
