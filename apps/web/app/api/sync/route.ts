import { NextResponse } from 'next/server'
import { prisma, BossKoncowy, TrybGry } from '@isaacdex/db'
import mapaMarek from '@/lib/marki-mapa.json'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const APPID = '250900' // The Binding of Isaac: Rebirth

type SchemaAch = { name: string; displayName: string; description?: string; icon?: string }
type PlayerAch = { apiname: string; achieved: number; unlocktime: number }
type GlobalAch = { name: string; percent: number | string }

async function jget<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-store' })
  if (!r.ok) throw new Error(`Steam HTTP ${r.status}`)
  return (await r.json()) as T
}

// POST /api/sync — zassij achievementy TBOI ze Steam Web API do bazy.
export async function POST() {
  const key = process.env.STEAM_API_KEY
  if (!key) return NextResponse.json({ error: 'Brak STEAM_API_KEY na serwerze.' }, { status: 500 })

  const profil = await prisma.profil.findFirst()
  if (!profil) return NextResponse.json({ error: 'Brak profilu.' }, { status: 400 })
  const sid = profil.steamId64

  const schema = await jget<{ game?: { availableGameStats?: { achievements?: SchemaAch[] } } }>(
    `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${APPID}`,
  )
  const player = await jget<{
    playerstats?: { success?: boolean; error?: string; achievements?: PlayerAch[] }
  }>(
    `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=${APPID}&key=${key}&steamid=${sid}`,
  )

  // WYKRYWANIE PRYWATNEGO PROFILU (Game details) — funkcja z wymagań.
  if (!player.playerstats?.success) {
    return NextResponse.json(
      {
        private: true,
        error: 'Szczegóły gry (Game details) są prywatne — ustaw je na publiczne w Steam.',
      },
      { status: 409 },
    )
  }

  const global = await jget<{ achievementpercentages?: { achievements?: GlobalAch[] } }>(
    `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${APPID}&format=json`,
  )

  const stats = schema.game?.availableGameStats?.achievements ?? []
  const pmap = new Map((player.playerstats.achievements ?? []).map((a) => [a.apiname, a]))
  const gmap = new Map(
    (global.achievementpercentages?.achievements ?? []).map((a) => [a.name, Number(a.percent)]),
  )

  const rows = stats.map((s) => {
    const p = pmap.get(s.name)
    const achieved = p?.achieved === 1
    const gp = gmap.get(s.name)
    return {
      profilId: profil.id,
      apiName: s.name,
      nazwa: s.displayName,
      opis: s.description ?? null,
      ikonaUrl: s.icon ?? null,
      globalnyProcent: gp != null ? Math.round(gp * 100) / 100 : null,
      odblokowany: achieved,
      dataOdblokowania: achieved && p?.unlocktime ? new Date(p.unlocktime * 1000) : null,
    }
  })

  await prisma.$transaction([
    prisma.steamAchievement.deleteMany({ where: { profilId: profil.id } }),
    prisma.steamAchievement.createMany({ data: rows }),
    prisma.profil.update({ where: { id: profil.id }, data: { ostatniSync: new Date() } }),
  ])

  // AUTO-MARKI: mapowanie achievement → (postać, boss) (z wiki) + odblokowania usera.
  // Każda marka odblokowuje unikalny item, więc posiadanie itemu = zaliczona marka.
  const unlockedNames = new Set(rows.filter((r) => r.odblokowany).map((r) => r.nazwa))
  const postacie = await prisma.postac.findMany()
  const idByName = new Map(postacie.map((p) => [p.nazwa, p.id]))
  const mapa = mapaMarek as Record<string, { postac: string; boss: string }>

  const markRows = []
  for (const [achName, mv] of Object.entries(mapa)) {
    if (!unlockedNames.has(achName)) continue
    const pid = idByName.get(mv.postac)
    if (pid == null) continue
    markRows.push({
      profilId: profil.id,
      postacId: pid,
      boss: mv.boss as BossKoncowy,
      tryb: TrybGry.HARD,
      zaliczone: true,
      data: new Date(),
    })
  }

  await prisma.$transaction([
    prisma.completionMark.deleteMany({ where: { profilId: profil.id } }),
    prisma.completionMark.createMany({ data: markRows, skipDuplicates: true }),
  ])

  const unlocked = rows.filter((r) => r.odblokowany).length
  return NextResponse.json({ ok: true, total: rows.length, unlocked, marek: markRows.length })
}
