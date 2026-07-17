import { NextResponse } from 'next/server'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/profil — zapisz ustawienia profilu (nick, opis, ulubiona postać, avatar, ozdoba).
//
// Nick i opis żyją w DWÓCH miejscach i to nie jest przypadek: na Graczu (tożsamość
// w feedzie i czacie — istnieje nawet bez Steama) oraz na Profilu (dane konta Steam).
// Zapis idzie do obu, żeby nie rozjechały się po edycji.
//
// Avatar i ozdoba siedziały kiedyś w localStorage, czyli widział je tylko właściciel
// przeglądarki — dla wszystkich innych profil wyglądał inaczej (albo apka zgadywała ozdobę
// z nicku). Dlatego lądują tu, w bazie.
export async function POST(req: Request) {
  const ja = await mojGracz()
  if (!ja)
    return NextResponse.json({ error: 'Zaloguj się, żeby edytować profil.' }, { status: 401 })

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nick = typeof b.nick === 'string' ? b.nick.trim().slice(0, 40) : undefined
  const opis = typeof b.opis === 'string' ? b.opis.slice(0, 300) : undefined
  const ulubionaPostac = typeof b.ulubionaPostac === 'string' ? b.ulubionaPostac : undefined
  // `avatar`: nazwa postaci z gry albo adres wgranego zdjęcia; null = wróć do ikony postaci.
  const avatar = b.avatar === null ? null : typeof b.avatar === 'string' ? b.avatar : undefined
  const dekoracja = typeof b.dekoracja === 'string' ? b.dekoracja.slice(0, 32) : undefined
  const gablota = Array.isArray(b.gablota)
    ? b.gablota.filter((x): x is string => typeof x === 'string').slice(0, 3)
    : undefined

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
      ...(avatar !== undefined ? { avatar } : {}),
      ...(dekoracja !== undefined ? { dekoracja } : {}),
      ...(gablota !== undefined ? { gablota } : {}),
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
