// Dostęp do danych dla frontendu (server-side). Reużywa Prisma (@isaacdex/db)
// i logikę (@isaacdex/core) — ten sam kod co backend, bez duplikacji reguł.
import { prisma, BossKoncowy, TrybGry } from '@isaacdex/db'
import { procentUkonczenia, ocenItem, type Jakosc } from '@isaacdex/core'
import { jaGracz } from '@/lib/konto'

/**
 * Profil, którego dane właśnie oglądamy: zalogowanego gracza, a dla gościa — właściciela apki.
 * Null = konto bez podpiętego Steama, czyli nie ma jeszcze żadnych achievementów.
 *
 * Wcześniej apka brała `profil.findFirst()`, bo profil był jeden. Odkąd są konta, „pierwszy
 * z brzegu” pokazywałby cudze osiągnięcia — stąd to jedno miejsce, przez które idą wszystkie odczyty.
 */
export async function profilWidoku() {
  const ja = await jaGracz()
  if (!ja?.profilId) return null
  return prisma.profil.findUnique({ where: { id: ja.profilId } })
}

export async function getItemyZOcena() {
  const items = await prisma.item.findMany({ orderBy: [{ jakosc: 'desc' }, { nazwa: 'asc' }] })
  return items.map((i) => ({
    idW: i.idW,
    nazwa: i.nazwa,
    jakosc: i.jakosc,
    typ: i.typ,
    tagi: i.tagi,
    opis: i.opis,
    ...ocenItem({ nazwa: i.nazwa, jakosc: i.jakosc as Jakosc, tagi: i.tagi }),
  }))
}

export const LICZBA_BOSSOW = Object.keys(BossKoncowy).length
export const LICZBA_TRYBOW = Object.keys(TrybGry).length
// Marki są wyliczane z achievementów (Hard) — jedna na bossa.
export const MARK_NA_POSTAC = LICZBA_BOSSOW

/** Lekki odczyt kontekstu companiona (dla layoutu): nick + czy Steam zsynchronizowany. */
export async function getCompanionInfo(): Promise<{ nick: string; steamConnected: boolean }> {
  const profil = await profilWidoku()
  return {
    nick: profil?.nick ?? 'Isaac',
    steamConnected: profil?.ostatniSync != null,
  }
}

export async function getDashboard() {
  // Niezależne zapytania równolegle (mniej round-tripów do bazy).
  const [profil, postacie] = await Promise.all([
    profilWidoku(),
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

  const lista = postacie
    .map((p) => {
      const zal = perPostac.get(p.id) ?? 0
      return { nazwa: p.nazwa, zaliczone: zal, procent: procentUkonczenia(zal, MARK_NA_POSTAC) }
    })
    .sort((a, b) => b.procent - a.procent || a.nazwa.localeCompare(b.nazwa))
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
  const profil = await profilWidoku()
  const marks = profil
    ? await prisma.completionMark.findMany({
        where: { profilId: profil.id, postacId: postac.id },
      })
    : []
  const zaznaczone = marks.filter((m) => m.zaliczone).map((m) => `${m.boss}:${m.tryb}`)
  const roster = await prisma.postac.findMany({
    orderBy: { kolejnosc: 'asc' },
    select: { nazwa: true },
  })
  return {
    postac: postac.nazwa,
    bossy: Object.values(BossKoncowy) as string[],
    tryby: ['HARD'],
    zaznaczone,
    roster: roster.map((r) => r.nazwa),
  }
}

export async function getKolekcja() {
  const profil = await profilWidoku()
  if (!profil) return { achievements: [], ostatniSync: null }
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
  return { achievements, ostatniSync: profil.ostatniSync ? profil.ostatniSync.toISOString() : null }
}

export async function getProfil() {
  const profil = await profilWidoku()
  if (!profil) return null
  const [ach, markGroups, postacie] = await Promise.all([
    prisma.steamAchievement.findMany({ where: { profilId: profil.id } }),
    prisma.completionMark.groupBy({
      by: ['postacId'],
      where: { profilId: profil.id, zaliczone: true },
      _count: { _all: true },
    }),
    prisma.postac.findMany(),
  ])
  const unlocked = ach.filter((a) => a.odblokowany)
  const total = ach.length

  const postacMap = new Map(postacie.map((p) => [p.id, p.nazwa]))
  let fav: { nazwa: string; count: number } | null = null
  for (const g of markGroups) {
    const c = g._count._all
    if (!fav || c > fav.count) fav = { nazwa: postacMap.get(g.postacId) ?? '?', count: c }
  }
  const marksTotal = markGroups.reduce((s, g) => s + g._count._all, 0)

  const showcase = unlocked
    .filter((a) => a.globalnyProcent != null && a.ikonaUrl)
    .sort((x, y) => Number(x.globalnyProcent) - Number(y.globalnyProcent))
    .slice(0, 6)
    .map((a) => ({ nazwa: a.nazwa, ikonaUrl: a.ikonaUrl, p: Number(a.globalnyProcent) }))

  const recent = unlocked
    .filter((a) => a.dataOdblokowania)
    .sort((x, y) => y.dataOdblokowania!.getTime() - x.dataOdblokowania!.getTime())
    .slice(0, 6)
    .map((a) => ({ nazwa: a.nazwa, ikonaUrl: a.ikonaUrl, data: a.dataOdblokowania!.toISOString() }))

  return {
    nick: profil.nick ?? 'Isaac',
    opis: profil.opis ?? '',
    ulubiona: profil.ulubionaPostac ?? '',
    steamId: profil.steamId64,
    achUnlocked: unlocked.length,
    achTotal: total,
    achProcent: total ? Math.round((unlocked.length / total) * 100) : 0,
    fav,
    marksTotal,
    showcase,
    recent,
  }
}

/** Nazwy odblokowanych achievementów Steam — np. do oznaczenia itemów w Encyklopedii. */
export async function getOdblokowaneAchievementy(): Promise<Set<string>> {
  const profil = await profilWidoku()
  if (!profil) return new Set()
  const a = await prisma.steamAchievement.findMany({
    where: { profilId: profil.id, odblokowany: true },
    select: { nazwa: true },
  })
  return new Set(a.map((x) => x.nazwa))
}

export async function getProfilSetup() {
  const [profil, postacie] = await Promise.all([
    profilWidoku(),
    prisma.postac.findMany({ orderBy: { kolejnosc: 'asc' } }),
  ])
  // Nazwy (displayName) odblokowanych achievementów — do bramkowania zablokowanych dekoracji.
  const odblokowane = profil
    ? (
        await prisma.steamAchievement.findMany({
          where: { profilId: profil.id, odblokowany: true },
          select: { nazwa: true },
        })
      ).map((a) => a.nazwa)
    : []
  return {
    nick: profil?.nick ?? '',
    opis: profil?.opis ?? '',
    ulubionaPostac: profil?.ulubionaPostac ?? '',
    steamId: profil?.steamId64 ?? '',
    zsynchronizowano: profil?.ostatniSync != null,
    postacie: postacie.map((p) => p.nazwa),
    odblokowane,
  }
}

export async function getStatystyki() {
  const profil = await profilWidoku()
  if (!profil) return null
  const all = await prisma.steamAchievement.findMany({ where: { profilId: profil.id } })
  const unlocked = all.filter((a) => a.odblokowany)
  const total = all.length

  const buckets = { legendarne: 0, rzadkie: 0, czeste: 0 }
  let rarest: { nazwa: string; p: number } | null = null
  for (const a of unlocked) {
    const p = a.globalnyProcent != null ? Number(a.globalnyProcent) : 100
    if (p < 5) buckets.legendarne++
    else if (p < 20) buckets.rzadkie++
    else buckets.czeste++
    if (!rarest || p < rarest.p) rarest = { nazwa: a.nazwa, p }
  }

  const withDate = unlocked
    .filter((a) => a.dataOdblokowania)
    .sort((x, y) => x.dataOdblokowania!.getTime() - y.dataOdblokowania!.getTime())
  const byMonth = new Map<string, number>()
  for (const a of withDate) {
    const d = a.dataOdblokowania!
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
  }
  let cum = 0
  const seria = [...byMonth.entries()].map(([m, c]) => {
    cum += c
    return { m, cum }
  })
  const latest = withDate.length ? withDate[withDate.length - 1] : null

  return {
    total,
    unlocked: unlocked.length,
    procent: total ? Math.round((unlocked.length / total) * 100) : 0,
    buckets,
    rarest,
    seria,
    latest: latest ? { nazwa: latest.nazwa, data: latest.dataOdblokowania!.toISOString() } : null,
  }
}

/**
 * Kilka realnych achievementów ze Steama (z ikonami z CDN) do demo-feedu znajomych.
 * Bierzemy odblokowane z ikoną; jak mało, dobieramy dowolne z ikoną.
 */
export async function getFeedIkony(ile = 6) {
  const profil = await profilWidoku()
  if (!profil) return []
  const ach = await prisma.steamAchievement.findMany({
    where: { profilId: profil.id, ikonaUrl: { not: null } },
    orderBy: [{ odblokowany: 'desc' }, { dataOdblokowania: 'desc' }],
    take: ile,
    select: { nazwa: true, ikonaUrl: true },
  })
  return ach.map((a) => ({ nazwa: a.nazwa, ikonaUrl: a.ikonaUrl as string }))
}
