import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import { MIEJSC_GABLOTY } from '@/lib/gablota'
import { tlumacz } from '@/lib/i18n/serwer'

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
  // Komunikaty błędów lądują wprost w interfejsie (edytor profilu je wypisuje), więc lecą
  // w języku użytkownika — ciasteczko języka jest przy żądaniu tak samo jak przy renderze.
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return NextResponse.json({ error: t('profil.bladNiezalogowany') }, { status: 401 })

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nick = typeof b.nick === 'string' ? b.nick.trim().slice(0, 40) : undefined
  const opis = typeof b.opis === 'string' ? b.opis.slice(0, 300) : undefined
  const ulubionaPostac = typeof b.ulubionaPostac === 'string' ? b.ulubionaPostac : undefined
  // `avatar`: nazwa postaci z gry albo adres wgranego zdjęcia; null = wróć do ikony postaci.
  const avatar = b.avatar === null ? null : typeof b.avatar === 'string' ? b.avatar : undefined
  const dekoracja = typeof b.dekoracja === 'string' ? b.dekoracja.slice(0, 32) : undefined
  // `wybranyTytul`: id zdobytego tytułu pod nickiem albo null = „Auto" (najwyższy). Wyboru NIE
  // weryfikujemy tu twardo — render (lib/odznaki) i tak cicho ignoruje tytuł, którego gracz nie
  // ma zdobytego, więc „oszukany" wybór nic nie daje. Ucinamy tylko długość dla bezpieczeństwa.
  const wybranyTytul =
    b.wybranyTytul === null
      ? null
      : typeof b.wybranyTytul === 'string'
        ? b.wybranyTytul.slice(0, 64)
        : undefined
  const gablota = Array.isArray(b.gablota)
    ? b.gablota.filter((x): x is string => typeof x === 'string').slice(0, MIEJSC_GABLOTY)
    : undefined

  // Nick widnieje pod każdym wpisem, więc musi być unikalny — inaczej dwóch graczy
  // byłoby w feedzie nie do odróżnienia.
  if (nick && nick !== ja.nick) {
    const zajety = await prisma.gracz.findUnique({ where: { nick } })
    if (zajety) return NextResponse.json({ error: t('profil.bladNickZajety') }, { status: 409 })
  }

  await prisma.gracz.update({
    where: { id: ja.id },
    data: {
      ...(nick !== undefined ? { nick } : {}),
      ...(opis !== undefined ? { opis } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
      ...(dekoracja !== undefined ? { dekoracja } : {}),
      ...(wybranyTytul !== undefined ? { wybranyTytul } : {}),
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

  // Nick i avatar widnieją w TopBarze i Sidebarze (renderowanych w layoucie) — bez unieważnienia
  // layoutu zostawałyby stare aż do twardego przeładowania (stąd „w edytorze inny nick niż w
  // prawym górnym rogu"). `router.refresh()` po stronie klienta dokłada odświeżenie widoku.
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
