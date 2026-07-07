import { NextResponse } from 'next/server'
import { prisma, BossKoncowy, TrybGry } from '@isaacdex/db'
import { sprawdzReguleHard } from '@isaacdex/core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BOSSY = new Set<string>(Object.values(BossKoncowy))
const TRYBY = new Set<string>(Object.values(TrybGry))

// POST /api/completion {postac, boss, tryb, zaliczone} — zaznacz/odznacz mark.
// Reguła: HARD wymaga wcześniej zaliczonego NORMAL.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nazwaPostaci = String(body.postac ?? '').trim()
  const boss = String(body.boss ?? '')
  const tryb = String(body.tryb ?? '')
  const zaliczone = body.zaliczone !== false

  if (!BOSSY.has(boss) || !TRYBY.has(tryb)) {
    return NextResponse.json({ error: 'Nieznany boss lub tryb.' }, { status: 400 })
  }
  const postac = await prisma.postac.findUnique({ where: { nazwa: nazwaPostaci } })
  if (!postac) return NextResponse.json({ error: 'Nie ma takiej postaci.' }, { status: 404 })
  const profil = await prisma.profil.findFirst()
  if (!profil) return NextResponse.json({ error: 'Brak profilu.' }, { status: 400 })

  if (zaliczone && tryb === TrybGry.HARD) {
    const normal = await prisma.completionMark.findUnique({
      where: {
        profilId_postacId_boss_tryb: {
          profilId: profil.id,
          postacId: postac.id,
          boss: boss as BossKoncowy,
          tryb: TrybGry.NORMAL,
        },
      },
    })
    const regula = sprawdzReguleHard('HARD', Boolean(normal?.zaliczone))
    if (!regula.ok) return NextResponse.json({ error: regula.powod }, { status: 409 })
  }

  await prisma.completionMark.upsert({
    where: {
      profilId_postacId_boss_tryb: {
        profilId: profil.id,
        postacId: postac.id,
        boss: boss as BossKoncowy,
        tryb: tryb as TrybGry,
      },
    },
    update: { zaliczone, data: zaliczone ? new Date() : null },
    create: {
      profilId: profil.id,
      postacId: postac.id,
      boss: boss as BossKoncowy,
      tryb: tryb as TrybGry,
      zaliczone,
      data: zaliczone ? new Date() : null,
    },
  })

  return NextResponse.json({ ok: true, zaliczone })
}
