import { NextResponse } from 'next/server'
import { getWizytowke } from '@/lib/social'
import { getSteamGracza } from '@/lib/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/gracz/[nick] — mini-wizytówka gracza pod dymek na hover.
 *
 * Osobno od strony profilu, bo dymek potrzebuje ułamka tych danych i ma być lekki:
 * `LinkGracza` zna tylko nick (tak jest w feedzie, na czacie i w powiadomieniach),
 * więc resztę dobiera stąd — dopiero gdy ktoś naprawdę najedzie kursorem.
 *
 * Relacja (`obserwowany`, `znajomy`) liczona jest względem ZALOGOWANEGO — to samo,
 * co pokazuje przycisk „Obserwuj" na kartach.
 *
 * Postęp podajemy TYLKO, gdy gracz ma podpięty Steam. Kiedyś w tym miejscu były procent,
 * godziny i „Dead God" wyliczone z hasza nicku — dymek wyglądał przez to konkretnie,
 * choć nie wiedział o graczu nic.
 */
export async function GET(_req: Request, { params }: { params: { nick: string } }) {
  const g = await getWizytowke(decodeURIComponent(params.nick))
  if (!g) return NextResponse.json({ znaleziony: false }, { status: 404 })

  const steam = await getSteamGracza(g.profilId)

  return NextResponse.json({
    znaleziony: true,
    nick: g.nick,
    kolor: g.kolor,
    avatar: g.avatar,
    dekoracja: g.dekoracja,
    opis: g.opis,
    ja: g.ja,
    znajomy: g.znajomy,
    obserwowany: g.obserwowany,
    obserwujeMnie: g.obserwujeMnie,
    obserwujacych: g.obserwujacych,
    wpisy: g.wpisy,
    procent: steam?.achProcent ?? null,
  })
}
