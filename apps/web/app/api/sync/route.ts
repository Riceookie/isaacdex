import { NextResponse } from 'next/server'
import { prisma, BossKoncowy, TrybGry, TypWpisu } from '@isaacdex/db'
import mapaMarek from '@/lib/marki-mapa.json'
import mapaMarekTainted from '@/lib/marki-tainted.json'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'

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
// Synchronizujemy WYŁĄCZNIE Steam zalogowanego gracza: inaczej dowolny gość mógłby
// odświeżać cudze osiągnięcia (a przy okazji zużywać nasz limit Web API).
export async function POST() {
  // Błędy z tego endpointu lądują wprost na ekranie Kolekcji, więc mówią językiem gracza.
  const t = tlumacz()
  const key = process.env.STEAM_API_KEY
  if (!key) return NextResponse.json({ error: t('kolekcja.apiBrakKlucza') }, { status: 500 })

  const ja = await mojGracz()
  if (!ja) return NextResponse.json({ error: t('kolekcja.apiZalogujBySync') }, { status: 401 })
  if (!ja.profilId) {
    return NextResponse.json({ error: t('kolekcja.apiPodlaczSteam') }, { status: 400 })
  }

  const profil = await prisma.profil.findUnique({ where: { id: ja.profilId } })
  if (!profil) return NextResponse.json({ error: t('kolekcja.apiBrakProfilu') }, { status: 400 })
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
        error: t('kolekcja.apiProfilPrywatny'),
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
  // Dopasowanie odporne na wielkość liter i spacje (Steam: „D Infinity", „ 'M").
  const norm = (s: string) => s.trim().toLowerCase()
  const unlockedNames = new Set(rows.filter((r) => r.odblokowany).map((r) => norm(r.nazwa)))
  const postacie = await prisma.postac.findMany()
  const idByName = new Map(postacie.map((p) => [p.nazwa, p.id]))
  const mapa = mapaMarek as Record<string, { postac: string; boss: string }>

  const markRows = []
  for (const [achName, mv] of Object.entries(mapa)) {
    if (!unlockedNames.has(norm(achName))) continue
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

  // AUTO-MARKI SKAŻONYCH (Tainted): u nich Web API nie zwraca marek jako osobnych achievementów,
  // ale KAŻDA Skażona postać ma 6 achievementów-itemów za pokonanie konkretnych bossów właśnie
  // NIĄ (np. Tainted Isaac: „Glitched Crown" = pokonaj The Beast → marka BEAST; „Mom's Lock" =
  // Isaac+???+Satan+Lamb → te 4 marki + Mom's Heart, bo bez It Lives się tam nie dojdzie;
  // „Soul of X" = Hush+Boss Rush). Posiadanie itemu = pokonany boss = zaliczona marka — dokładnie
  // jak u zwykłych postaci. Mapa (item → { tainted, bosze[] }) w lib/marki-tainted.json; nazwy
  // itemów i bossów zweryfikowane 1:1 ze schematem Steam i enumem BossKoncowy.
  const mapaTainted = mapaMarekTainted as Record<string, { tainted: string; bosze: string[] }>
  for (const [achName, mv] of Object.entries(mapaTainted)) {
    if (!unlockedNames.has(norm(achName))) continue
    const pid = idByName.get(mv.tainted)
    if (pid == null) continue
    for (const boss of mv.bosze) {
      markRows.push({
        profilId: profil.id,
        postacId: pid,
        boss: boss as BossKoncowy,
        tryb: TrybGry.HARD,
        zaliczone: true,
        data: new Date(),
      })
    }
  }

  await prisma.$transaction([
    prisma.completionMark.deleteMany({ where: { profilId: profil.id } }),
    prisma.completionMark.createMany({ data: markRows, skipDuplicates: true }),
  ])

  /**
   * FEED z prawdziwych odblokowań.
   *
   * Wpisy w feedzie brały się kiedyś z zasianych kont-botów. Teraz robi je Steam: każde
   * odblokowanie z datą to jeden wpis, z prawdziwą ikoną i prawdziwym czasem zdobycia.
   *
   * Dokładamy tylko NOWE (po nazwie), więc kolejny sync nie duplikuje feedu, a wpisy, które
   * ktoś zdążył polubić, zostają na miejscu. Bierzemy wyłącznie odblokowania ze znaną datą —
   * bez niej wpis wylądowałby „dzisiaj", czyli skłamałby o tym, kiedy to się stało.
   */
  const gracz = await prisma.gracz.findFirst({ where: { profilId: profil.id } })
  let nowychWpisow = 0
  if (gracz) {
    const juzWFeedzie = new Set(
      (
        await prisma.wpis.findMany({
          where: { autorId: gracz.id, typ: TypWpisu.UNLOCK },
          select: { tresc: true },
        })
      ).map((w) => norm(w.tresc)),
    )
    const doDodania = rows
      .filter((r) => r.odblokowany && r.dataOdblokowania && !juzWFeedzie.has(norm(r.nazwa)))
      .map((r) => ({
        autorId: gracz.id,
        typ: TypWpisu.UNLOCK,
        tresc: r.nazwa,
        ikonaUrl: r.ikonaUrl,
        itemy: [],
        createdAt: r.dataOdblokowania!,
      }))
    if (doDodania.length > 0) {
      const { count } = await prisma.wpis.createMany({ data: doDodania })
      nowychWpisow = count
    }
  }

  const unlocked = rows.filter((r) => r.odblokowany).length
  return NextResponse.json({
    ok: true,
    total: rows.length,
    unlocked,
    marek: markRows.length,
    wpisow: nowychWpisow,
  })
}
