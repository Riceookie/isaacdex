import { NextResponse, type NextRequest } from 'next/server'
import { mojGracz } from '@/lib/konto'

/**
 * Start podpinania Steama: odsyłamy użytkownika na Steam OpenID 2.0.
 *
 * Steam nie daje OAuth, tylko OpenID — nie ma tu żadnego sekretu klienta ani zgody na dane.
 * Steam potwierdza jedną rzecz: „ten człowiek naprawdę jest właścicielem tego SteamID".
 * Resztę (achievementy) i tak dociągamy Web API kluczem, który mamy.
 */
export async function GET(request: NextRequest) {
  if (!(await mojGracz())) {
    return NextResponse.redirect(new URL('/logowanie', request.nextUrl.origin))
  }

  const powrot = new URL('/api/steam/powrot', request.nextUrl.origin)

  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': powrot.toString(),
    'openid.realm': request.nextUrl.origin,
    // „identifier_select" = to Steam ma nam powiedzieć, kim jesteś; my nie zgadujemy.
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  })

  return NextResponse.redirect(`https://steamcommunity.com/openid/login?${params}`)
}
