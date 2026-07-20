import { NextResponse } from 'next/server'
import { prisma } from '@isaacdex/db'
import { ocenItem, type Jakosc } from '@isaacdex/core'
import { tlumacz } from '@/lib/i18n/serwer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/advice?item=<nazwa>&boss=<BOSS> — doradca „brać czy zostawić".
export async function GET(req: Request) {
  // Komunikaty błędów czyta użytkownik (lądują wprost w formularzu), więc lecą w jego języku.
  const t = tlumacz()
  const url = new URL(req.url)
  const nazwa = (url.searchParams.get('item') ?? '').trim()
  if (!nazwa) return NextResponse.json({ error: t('kolekcja.apiPodajNazwe') }, { status: 400 })

  const item = await prisma.item.findUnique({ where: { nazwa } })
  if (!item) {
    return NextResponse.json({ error: t('kolekcja.apiNieznanyItem', { nazwa }) }, { status: 404 })
  }

  const boss = url.searchParams.get('boss') ?? undefined
  const ocena = ocenItem(
    { nazwa: item.nazwa, jakosc: item.jakosc as Jakosc, tagi: item.tagi },
    { przeciwBossowi: boss },
  )
  return NextResponse.json({ item: item.nazwa, jakosc: item.jakosc, ...ocena })
}
