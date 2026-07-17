import { NextResponse } from 'next/server'
import { getPowiadomienia } from '@/lib/powiadomienia'

export const dynamic = 'force-dynamic'

/** Powiadomienia zalogowanego gracza — dzwonek dociąga je po wejściu na stronę. */
export async function GET() {
  return NextResponse.json({ powiadomienia: await getPowiadomienia() })
}
