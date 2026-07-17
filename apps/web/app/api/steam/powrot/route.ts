import { NextResponse, type NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'
import { prisma } from '@isaacdex/db'
import { mojGracz, zalozGracza } from '@/lib/konto'
import { supabaseSerwer } from '@/lib/supabase/serwer'

/**
 * Powrót ze Steama. Nie wierzymy parametrom z adresu — odsyłamy je Steamowi z pytaniem
 * „czy to na pewno podpisałeś Ty?" (`check_authentication`). Bez tego kroku każdy mógłby
 * wpisać sobie w URL cudze SteamID i przejąć jego achievementy.
 *
 * Dwa tryby, zależnie od tego, czy ktoś jest już zalogowany:
 *  - ZALOGOWANY  → podpięcie Steama do istniejącego konta (link).
 *  - GOŚĆ        → „Zaloguj się przez Steam": zakładamy/logujemy konto Supabase wyliczone
 *                  deterministycznie ze SteamID (bez maila i hasła), potem podpinamy profil.
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

/** Syntetyczny e-mail i hasło wyliczone ze SteamID — te same przy każdym logowaniu przez Steam. */
function danesteamowe(steamId64: string) {
  const sekret = process.env.STEAM_AUTH_SECRET || process.env.STEAM_API_KEY || 'isaacdex-steam'
  const haslo = createHmac('sha256', sekret).update(steamId64).digest('hex')
  return { email: `steam.${steamId64}@steamid.isaacdex.app`, haslo }
}

/** Nick dla świeżego konta ze Steama: persona ze Steam Web API, a jak się nie uda — `Gracz<last4>`. */
async function nickZeSteam(steamId64: string): Promise<string> {
  const key = process.env.STEAM_API_KEY
  if (key) {
    try {
      const r = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId64}`,
      )
      const j = await r.json()
      const nazwa = j?.response?.players?.[0]?.personaname
      if (typeof nazwa === 'string' && nazwa.trim()) return nazwa.trim().slice(0, 24)
    } catch {
      // Brak persony to nie błąd — wpadamy w fallback poniżej.
    }
  }
  return `Gracz${steamId64.slice(-4)}`
}

/**
 * Gość loguje się przez Steam: znajdź albo załóż konto Supabase (deterministyczne dane),
 * ustaw sesję i zwróć gracza. Wymaga wyłączonego „Confirm email" w Supabase — inaczej
 * signUp nie zwraca sesji. Zwraca null, gdy się nie udało (np. logowanie nieskonfigurowane).
 */
async function zalogujGosciaPrzezSteam(steamId64: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  const supabase = await supabaseSerwer()
  const { email, haslo } = danesteamowe(steamId64)

  let user = null
  const wejscie = await supabase.auth.signInWithPassword({ email, password: haslo })
  if (wejscie.data.user) {
    user = wejscie.data.user
  } else {
    const rej = await supabase.auth.signUp({ email, password: haslo })
    if (rej.error) return null
    if (rej.data.session) {
      user = rej.data.user
    } else {
      // Confirm email włączony → signUp nie dał sesji; spróbuj jeszcze raz zalogować.
      const drugie = await supabase.auth.signInWithPassword({ email, password: haslo })
      user = drugie.data.user
    }
  }
  if (!user) return null

  const nick = await nickZeSteam(steamId64)
  return zalozGracza(user.id, nick)
}

const wroc = (origin: string, stan: string) =>
  NextResponse.redirect(new URL(`/kim-jestem?steam=${stan}`, origin))

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  const steamId64 = await potwierdzoneSteamId(request.nextUrl.searchParams)

  let ja = await mojGracz()
  // Gość → „Zaloguj się przez Steam". Błąd weryfikacji odsyłamy na stronę logowania.
  if (!ja) {
    if (!steamId64) return NextResponse.redirect(new URL('/logowanie?blad=steam', origin))
    ja = await zalogujGosciaPrzezSteam(steamId64)
    if (!ja) return NextResponse.redirect(new URL('/logowanie?blad=steam', origin))
  }
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
