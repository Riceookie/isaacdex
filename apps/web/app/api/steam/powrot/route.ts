import { NextResponse, type NextRequest } from 'next/server'
import { createHmac } from 'node:crypto'
import { prisma } from '@isaacdex/db'
import { mojGracz, zalozGracza } from '@/lib/konto'
import { supabaseSerwer } from '@/lib/supabase/serwer'
import { zalogujNaKonto } from '@/lib/supabase/admin'
import { logowanieDziala } from '@/lib/supabase/konfiguracja'
import { tlumacz } from '@/lib/i18n/serwer'

/**
 * Powrót ze Steama. Nie wierzymy parametrom z adresu — odsyłamy je Steamowi z pytaniem
 * „czy to na pewno podpisałeś Ty?" (`check_authentication`). Bez tego kroku każdy mógłby
 * wpisać sobie w URL cudze SteamID i przejąć jego achievementy.
 *
 * Dwa tryby, zależnie od tego, czy ktoś jest już zalogowany:
 *  - ZALOGOWANY  → podpięcie Steama do istniejącego konta (link).
 *  - GOŚĆ        → „Zaloguj się przez Steam": jeśli tym SteamID KTOŚ już się loguje (konto
 *                  syntetyczne albo realne z podpiętym Steamem) — wchodzimy NA TO konto;
 *                  dopiero gdy nikt — zakładamy nowe konto wyliczone deterministycznie ze
 *                  SteamID i podpinamy profil.
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

/**
 * Nick dla świeżego konta ze Steama: persona ze Steam Web API, a jak się nie uda — zapasowy
 * „Gracz<last4>" / „Player<last4>" w języku, w którym akurat siedzi zakładający konto.
 * To jedyny nick, którego użytkownik nie wpisuje sam, więc nie ma komu pokazać formularza.
 */
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
  return tlumacz()('konto.nickZeSteamZapasowy', { koncowka: steamId64.slice(-4) })
}

/**
 * Gość loguje się przez Steam: znajdź albo załóż konto Supabase (deterministyczne dane),
 * ustaw sesję i zwróć gracza. Wymaga wyłączonego „Confirm email" w Supabase — inaczej
 * signUp nie zwraca sesji. Zwraca null, gdy się nie udało (np. logowanie nieskonfigurowane).
 */
async function zalogujGosciaPrzezSteam(steamId64: string) {
  if (!logowanieDziala()) return null // brak/zepsuty klucz — nie ma jak założyć sesji
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

/**
 * Gość wraca ze Steama, którym KTOŚ JUŻ się loguje (istnieje gracz z kontem podpięty do tego
 * SteamID). Wchodzimy NA TO konto zamiast zakładać drugie — o to właśnie chodzi w „Zaloguj
 * się przez Steam". Dwie drogi, bo konto bywa dwojakie:
 *  - SYNTETYCZNE (założone wcześniej przez Steam): znamy jego hasło (liczone ze SteamID),
 *    więc logujemy tanio i bez klucza administracyjnego — tak jak dotąd,
 *  - REALNE (e-mail/hasło z ręcznie podpiętym Steamem): hasła nie znamy, więc dopiero tu
 *    sięgamy po service_role i wchodzimy jednorazowym linkiem (patrz lib/supabase/admin).
 * Zwraca true, gdy sesja właściciela została ustawiona.
 */
async function zalogujNaKontoWlasciciela(steamId64: string, userId: string): Promise<boolean> {
  if (!logowanieDziala()) return false
  const supabase = await supabaseSerwer()
  const { email, haslo } = danesteamowe(steamId64)
  const proba = await supabase.auth.signInWithPassword({ email, password: haslo })
  if (proba.data.user?.id === userId) return true // to było konto syntetyczne — gotowe

  // Albo konta syntetycznego nie ma (Steam podpięty do konta e-mail), albo zalogowaliśmy się
  // NIE do tego konta — w obu razach sprzątamy tę sesję i wchodzimy właściwym kontem przez
  // link administracyjny. Bez signOut nieudany admin zostawiłby w ciasteczkach złą sesję.
  if (proba.data.user) await supabase.auth.signOut()
  return zalogujNaKonto(userId) // konto realne — wejście linkiem administracyjnym
}

/**
 * Dokąd wrócić po Steamie — a to zależy od tego, PO CO tu przyszedłeś.
 *
 *  - LOGOWANIE przez Steam (byłeś gościem): to jest wejście do apki, więc lądujesz na
 *    Pulpicie. Kiedyś każdy trafiał do edytora profilu — czyli świeży użytkownik zaczynał
 *    od formularza z pytaniem, kim jest, zamiast od apki.
 *  - PODPINANIE Steama (byłeś już zalogowany): przyszedłeś z edytora, więc tam wracasz
 *    razem ze statusem operacji.
 */
const wroc = (origin: string, stan: string, bylGosciem: boolean) =>
  NextResponse.redirect(new URL(bylGosciem ? '/' : `/kim-jestem?steam=${stan}`, origin))

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  const steamId64 = await potwierdzoneSteamId(request.nextUrl.searchParams)

  let ja = await mojGracz()
  // Zapamiętane PRZED zalogowaniem: niżej `ja` już istnieje i nie dałoby się tego odróżnić.
  const bylGosciem = !ja

  // Gość → „Zaloguj się przez Steam". Błąd weryfikacji odsyłamy na stronę logowania.
  if (!ja) {
    if (!steamId64) return NextResponse.redirect(new URL('/logowanie?blad=steam', origin))

    // Najpierw SZUKAMY konta z tym SteamID (find), a dopiero gdy żadne nie istnieje —
    // ZAKŁADAMY nowe (create). Wcześniej krok „find" patrzył tylko na syntetyczny mail konta
    // steamowego, więc Steam podpięty do konta e-mail/hasłem był niewidoczny i za każdym
    // logowaniem powstawało drugie, syntetyczne konto zamiast wejścia na istniejące.
    const wlasciciel = await prisma.gracz.findFirst({
      where: { profil: { steamId64 }, userId: { not: null } },
    })
    if (wlasciciel?.userId) {
      const ok = await zalogujNaKontoWlasciciela(steamId64, wlasciciel.userId)
      return NextResponse.redirect(new URL(ok ? '/' : '/logowanie?blad=steam', origin))
    }

    ja = await zalogujGosciaPrzezSteam(steamId64)
    if (!ja) return NextResponse.redirect(new URL('/logowanie?blad=steam', origin))
  }
  if (!steamId64) return wroc(origin, 'blad', bylGosciem)

  const zajety = await prisma.gracz.findFirst({
    where: { profil: { steamId64 }, NOT: { id: ja.id } },
  })

  // Konto Steam jest jedno. Jeśli trzyma je ktoś Z KONTEM — nie odbieramy mu go.
  // Gościowi nie ma co pokazywać edytora z błędem: wraca na logowanie, skąd przyszedł.
  if (zajety?.userId) {
    return bylGosciem
      ? NextResponse.redirect(new URL('/logowanie?blad=steam', origin))
      : wroc(origin, 'zajety', false)
  }

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

  return wroc(origin, 'ok', bylGosciem)
}
