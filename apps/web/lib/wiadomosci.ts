import 'server-only'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import {
  godzina,
  KANALY,
  kanalDm,
  LIMIT_WIADOMOSCI,
  nickZDm,
  OGLOSZENIA,
  type Wiad,
} from '@/lib/czat'

/**
 * Odczyt i zapis wiadomości czatu.
 *
 * Kanał z interfejsu („piwnica", „dm:Nick") jest tu tłumaczony na kanał z bazy.
 * Dla rozmowy prywatnej kanał liczymy z **własnego** ID i ID rozmówcy, więc nie da się
 * poprosić o cudzą rozmowę: nawet podając w adresie dowolny nick, dostaniesz kanał,
 * w którym i tak jesteś jedną ze stron. To cała autoryzacja DM-ów — bez osobnych sprawdzeń.
 */

export type StanKanalu = {
  /** Nazwa kanału w bazie („piwnica" / „dm:3-17"). Null = kanał, którego nie wolno czytać. */
  kanalDb: string | null
  wiadomosci: Wiad[]
}

/** Kanał z UI → kanał w bazie. Null, gdy taki kanał nie istnieje albo nie jesteś jego stroną. */
export async function kanalDlaSlugu(slug: string): Promise<string | null> {
  const nick = nickZDm(slug)

  if (nick) {
    const ja = await mojGracz()
    if (!ja) return null // gość nie ma rozmów prywatnych
    const rozmowca = await prisma.gracz.findUnique({ where: { nick }, select: { id: true } })
    if (!rozmowca || rozmowca.id === ja.id) return null
    return kanalDm(ja.id, rozmowca.id)
  }

  return KANALY.some((k) => k.slug === slug) ? slug : null
}

const doWiad = (w: {
  id: number
  tresc: string
  obrazekUrl: string | null
  utworzono: Date
  autor: { nick: string }
}): Wiad => ({
  id: String(w.id),
  autor: w.autor.nick,
  czas: godzina(w.utworzono),
  // Enter w polu daje wielolinijkową wiadomość; w bazie to jeden tekst, w UI — akapity.
  tekst: w.tresc ? w.tresc.split('\n') : [],
  obraz: w.obrazekUrl ?? undefined,
})

/** Wiadomości kanału, od najstarszej. Ogłoszenia są treścią bota, nie tabelą. */
export async function getWiadomosci(slug: string): Promise<StanKanalu> {
  if (slug === 'ogloszenia') return { kanalDb: 'ogloszenia', wiadomosci: OGLOSZENIA }

  const kanalDb = await kanalDlaSlugu(slug)
  if (!kanalDb) return { kanalDb: null, wiadomosci: [] }

  // Bierzemy OSTATNIE `LIMIT` (desc + take), a pokazujemy od najstarszej — stąd reverse.
  const wiersze = await prisma.wiadomosc.findMany({
    where: { kanal: kanalDb },
    orderBy: { utworzono: 'desc' },
    take: LIMIT_WIADOMOSCI,
    select: {
      id: true,
      tresc: true,
      obrazekUrl: true,
      utworzono: true,
      autor: { select: { nick: true } },
    },
  })

  return { kanalDb, wiadomosci: wiersze.reverse().map(doWiad) }
}
