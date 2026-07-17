import { NextResponse, type NextRequest } from 'next/server'
import { getWiadomosci } from '@/lib/wiadomosci'

export const dynamic = 'force-dynamic'

/**
 * Wiadomości kanału dla przeglądarki.
 *
 * Po co, skoro strona i tak renderuje się na serwerze: czat przełącza kanały bez
 * przeładowania, a po zdarzeniu z Realtime trzeba dociągnąć świeżą wiadomość razem
 * z autorem (nick, kolor, pfp) — payload z Realtime niesie same kolumny tabeli.
 *
 * Kanał jest tłumaczony w `getWiadomosci`, które dla rozmowy prywatnej liczy go z ID
 * pytającego. Cudzej rozmowy nie da się stąd wyciągnąć nawet znając nick.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('kanal')
  if (!slug) return NextResponse.json({ blad: 'Brak kanału' }, { status: 400 })

  const { kanalDb, wiadomosci } = await getWiadomosci(slug)
  if (!kanalDb) return NextResponse.json({ blad: 'Nie ma takiego kanału' }, { status: 404 })

  return NextResponse.json({ kanalDb, wiadomosci })
}
