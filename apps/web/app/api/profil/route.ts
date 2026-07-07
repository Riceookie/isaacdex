import { NextResponse } from 'next/server'
import { prisma } from '@isaacdex/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/profil — zapisz ustawienia profilu (nick, opis, ulubiona postać).
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nick = typeof b.nick === 'string' ? b.nick.trim().slice(0, 40) : undefined
  const opis = typeof b.opis === 'string' ? b.opis.slice(0, 300) : undefined
  const ulubionaPostac = typeof b.ulubionaPostac === 'string' ? b.ulubionaPostac : undefined

  const profil = await prisma.profil.findFirst()
  if (!profil) return NextResponse.json({ error: 'Brak profilu.' }, { status: 400 })

  await prisma.profil.update({
    where: { id: profil.id },
    data: {
      ...(nick !== undefined ? { nick } : {}),
      ...(opis !== undefined ? { opis } : {}),
      ...(ulubionaPostac !== undefined ? { ulubionaPostac } : {}),
    },
  })
  return NextResponse.json({ ok: true })
}
