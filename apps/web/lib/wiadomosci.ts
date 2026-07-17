import 'server-only'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import { godzina, KANALY, kanalDm, LIMIT_WIADOMOSCI, nickZDm, type Wiad } from '@/lib/czat'
import type { SpriteName } from '@/components/Sprite'

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

const doWiad = (
  w: {
    id: number
    tresc: string
    obrazekUrl: string | null
    utworzono: Date
    autor: { nick: string }
    reakcje: { ikona: string; graczId: number }[]
  },
  jaId?: number,
): Wiad => {
  // Reakcje zliczamy tu, a nie w bazie: wierszy pod jedną wiadomością są jednostki,
  // więc grupowanie w pamięci jest tańsze niż osobne zapytanie z GROUP BY.
  const licznik = new Map<string, number>()
  const moje = new Set<string>()
  for (const r of w.reakcje) {
    licznik.set(r.ikona, (licznik.get(r.ikona) ?? 0) + 1)
    if (jaId != null && r.graczId === jaId) moje.add(r.ikona)
  }

  return {
    id: String(w.id),
    autor: w.autor.nick,
    czas: godzina(w.utworzono),
    // Enter w polu daje wielolinijkową wiadomość; w bazie to jeden tekst, w UI — akapity.
    tekst: w.tresc ? w.tresc.split('\n') : [],
    obraz: w.obrazekUrl ?? undefined,
    reakcje: [...licznik.entries()].map(([ikona, ile]) => ({
      ikona: ikona as SpriteName,
      ile,
      moja: moje.has(ikona),
    })),
  }
}

/** Wiadomości kanału, od najstarszej. */
export async function getWiadomosci(slug: string): Promise<StanKanalu> {
  const kanalDb = await kanalDlaSlugu(slug)
  if (!kanalDb) return { kanalDb: null, wiadomosci: [] }

  // Bierzemy OSTATNIE `LIMIT` (desc + take), a pokazujemy od najstarszej — stąd reverse.
  const ja = await mojGracz()
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
      reakcje: { select: { ikona: true, graczId: true } },
    },
  })

  return { kanalDb, wiadomosci: wiersze.reverse().map((w) => doWiad(w, ja?.id)) }
}

/**
 * Czy ten kanał (nazwa Z BAZY) należy do gracza — publiczny należy do wszystkich,
 * a prywatny tylko do dwóch osób, których ID są w jego nazwie („dm:3-17").
 * Używane przy reakcjach: wiadomość znamy po ID, więc kanał trzeba sprawdzić wprost.
 */
export async function czyMojKanal(kanal: string, graczId: number): Promise<boolean> {
  if (KANALY.some((k) => k.slug === kanal)) return true
  const m = kanal.match(/^dm:(\d+)-(\d+)$/)
  if (!m) return false
  return Number(m[1]) === graczId || Number(m[2]) === graczId
}
