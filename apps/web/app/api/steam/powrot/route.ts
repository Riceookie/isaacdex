import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Powrót ze Steama. Nie wierzymy parametrom z adresu — odsyłamy je Steamowi z pytaniem
 * „czy to na pewno podpisałeś Ty?" (`check_authentication`). Bez tego kroku każdy mógłby
 * wpisać sobie w URL cudze SteamID i przejąć jego achievementy.
 */

const STEAM_OPENID = 'https://steamcommunity.com/openid/login'

async function potwierdzoneSteamId(params: URLSearchParams): Promise<string | null> {
  const doWeryfikacji = new URLSearchParams(params)
  doWeryfikacji.set('openid.mode', 'check_authentication')

  const odpowiedz = await fetch(STEAM_OPENID, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: doWeryfikacji,
  })
  const tekst = await odpowiedz.text()
  if (!/is_valid\s*:\s*true/i.test(tekst)) return null

  // claimed_id ma postać https://steamcommunity.com/openid/id/76561198990473445
  const id = params.get('openid.claimed_id')?.match(/\/openid\/id\/(\d{17})$/)?.[1]
  return id ?? null
}

const wroc = (origin: string, stan: string) =>
  NextResponse.redirect(new URL(`/kim-jestem?steam=${stan}`, origin))

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  const ja = await mojGracz()
  if (!ja) return NextResponse.redirect(new URL('/logowanie', origin))

  const steamId64 = await potwierdzoneSteamId(request.nextUrl.searchParams)
  if (!steamId64) return wroc(origin, 'blad')

  const zajety = await prisma.gracz.findFirst({
    where: { profil: { steamId64 }, NOT: { id: ja.id } },
  })

  // Konto Steam jest jedno. Jeśli trzyma je ktoś Z KONTEM — nie odbieramy mu go.
  if (zajety?.userId) return wroc(origin, 'zajety')

  const profil = await prisma.profil.upsert({
    where: { steamId64 },
    update: {},
    create: { steamId64, nick: ja.nick },
  })

  await prisma.$transaction(async (tx) => {
    // Steam mógł wisieć na graczu-demo (dane zsyncowane, zanim istniało logowanie).
    // OpenID właśnie udowodniło, kto jest właścicielem — przenosimy profil na jego konto.
    if (zajety) {
      await tx.gracz.update({ where: { id: zajety.id }, data: { profilId: null, ja: false } })
      // Właściciel apki to ten, kto naprawdę ma ten Steam — twarz pokazywana gościom idzie za nim.
      if (zajety.ja) await tx.gracz.update({ where: { id: ja.id }, data: { ja: true } })
    }
    await tx.gracz.update({ where: { id: ja.id }, data: { profilId: profil.id } })
  })

  return wroc(origin, 'ok')
}
