import { NextResponse } from 'next/server'
import { getWizytowke } from '@/lib/social'
import { statyGracza } from '@/lib/klimat'

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
 */
export async function GET(_req: Request, { params }: { params: { nick: string } }) {
  const g = await getWizytowke(decodeURIComponent(params.nick))
  if (!g) return NextResponse.json({ znaleziony: false }, { status: 404 })

  const s = statyGracza(g.nick)
  return NextResponse.json({
    znaleziony: true,
    nick: g.nick,
    kolor: g.kolor,
    avatar: g.avatar,
    opis: g.opis,
    ja: g.ja,
    znajomy: g.znajomy,
    obserwowany: g.obserwowany,
    obserwujeMnie: g.obserwujeMnie,
    obserwujacych: g.obserwujacych,
    wpisy: g.wpisy,
    // Placeholder z lib/klimat — te same liczby co na kartach w „Odkryj graczy",
    // żeby dymek nie przeczył temu, co widać obok.
    procent: s.procent,
    godziny: s.godziny,
    deadGod: s.deadGod,
  })
}
