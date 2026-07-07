import { NextResponse } from 'next/server'
import { prisma } from '@isaacdex/db'
import { ocenItem, type Jakosc } from '@isaacdex/core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/advice?item=<nazwa>&boss=<BOSS> — doradca „brać czy zostawić".
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const nazwa = (url.searchParams.get('item') ?? '').trim()
    if (!nazwa) return NextResponse.json({ error: 'Podaj nazwę itemu.' }, { status: 400 })

    const item = await prisma.item.findUnique({ where: { nazwa } })
    if (!item) return NextResponse.json({ error: `Nie znam itemu „${nazwa}".` }, { status: 404 })

    const boss = url.searchParams.get('boss') ?? undefined
    const ocena = ocenItem(
      { nazwa: item.nazwa, jakosc: item.jakosc as Jakosc, tagi: item.tagi },
      { przeciwBossowi: boss },
    )
    return NextResponse.json({ item: item.nazwa, jakosc: item.jakosc, ...ocena })
  } catch (e) {
    // TYMCZASOWA diagnostyka deploya — do usunięcia.
    return NextResponse.json(
      {
        _debug: e instanceof Error ? e.message : String(e),
        _hasDbUrl: Boolean(process.env.DATABASE_URL),
        _hasDirectUrl: Boolean(process.env.DIRECT_URL),
      },
      { status: 500 },
    )
  }
}
