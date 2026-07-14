import { NextResponse } from 'next/server'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/profil — zapisz ustawienia profilu (nick, opis, ulubiona postać).
//
// Nick i opis żyją w DWÓCH miejscach i to nie jest przypadek: na Graczu (tożsamość
// w feedzie i czacie — istnieje nawet bez Steama) oraz na Profilu (dane konta Steam).
// Zapis idzie do obu, żeby nie rozjechały się po edycji.
export async function POST(req: Request) {
  const ja = await mojGracz()
  if (!ja)
    return NextResponse.json({ error: 'Zaloguj się, żeby edytować profil.' }, { status: 401 })

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nick = typeof b.nick === 'string' ? b.nick.trim().slice(0, 40) : undefined
  const opis = typeof b.opis === 'string' ? b.opis.slice(0, 300) : undefined
  const ulubionaPostac = typeof b.ulubionaPostac === 'string' ? b.ulubionaPostac : undefined

  // Nick widnieje pod każdym wpisem, więc musi być unikalny — inaczej dwóch graczy
  // byłoby w feedzie nie do odróżnienia.
  if (nick && nick !== ja.nick) {
    const zajety = await prisma.gracz.findUnique({ where: { nick } })
    if (zajety) return NextResponse.json({ error: 'Ten nick jest już zajęty.' }, { status: 409 })
  }

  await prisma.gracz.update({
    where: { id: ja.id },
    data: {
      ...(nick !== undefined ? { nick } : {}),
      ...(opis !== undefined ? { opis } : {}),
    },
  })

  if (ja.profilId) {
    await prisma.profil.update({
      where: { id: ja.profilId },
      data: {
        ...(nick !== undefined ? { nick } : {}),
        ...(opis !== undefined ? { opis } : {}),
        ...(ulubionaPostac !== undefined ? { ulubionaPostac } : {}),
      },
    })
  }

  return NextResponse.json({ ok: true })
}
