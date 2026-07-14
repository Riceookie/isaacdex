import { prisma } from '@isaacdex/db'

/**
 * Społeczność: feed, obserwowanie, lajki. Wszystko leży w bazie (Gracz, Obserwacja, Wpis, Lajk),
 * więc obserwowanie i polubienia są TRWAŁE — nie są stanem komponentu jak w poprzedniej wersji.
 *
 * Apka nie ma jeszcze logowania, więc „ja" = gracz z flagą `ja` (profil właściciela).
 * Moje wpisy są generowane z prawdziwych achievementów Steam (nazwa, ikona, data).
 *
 * ZNAJOMY = obserwacja w OBIE strony (jak na Steamie). Samo obserwowanie kogoś to jeszcze
 * nie znajomość — stąd trzy różne zbiory: znajomi, obserwowani (jednostronnie) i obserwujący.
 */

export type FeedWpis = {
  id: number
  typ: 'UNLOCK' | 'BOSS' | 'RUN' | 'TEKST'
  tresc: string
  postac: string | null
  ikonaUrl: string | null
  itemy: string[]
  czas: string
  autor: { id: number; nick: string; kolor: string | null; avatar: string | null; ja: boolean }
  lajki: number
  polubione: boolean
}

/** Zakres feedu: wszyscy gracze albo tylko znajomi (obserwacja odwzajemniona) + Ty. */
export type ZakresFeedu = 'global' | 'znajomi'

/** Gracz-właściciel apki. */
export async function jaGracz() {
  return prisma.gracz.findFirst({ where: { ja: true } })
}

/** Kogo obserwujesz i kto obserwuje Ciebie — baza dla znajomych i przycisków. */
async function relacje(jaId: number) {
  const [obserwuje, obserwujaMnie] = await Promise.all([
    prisma.obserwacja.findMany({ where: { obserwujacyId: jaId }, select: { obserwowanyId: true } }),
    prisma.obserwacja.findMany({ where: { obserwowanyId: jaId }, select: { obserwujacyId: true } }),
  ])
  return {
    obserwuje: new Set(obserwuje.map((o) => o.obserwowanyId)),
    obserwujaMnie: new Set(obserwujaMnie.map((o) => o.obserwujacyId)),
  }
}

const PUSTE_RELACJE = { obserwuje: new Set<number>(), obserwujaMnie: new Set<number>() }

/** Znajomi = przecięcie „obserwuję" i „obserwują mnie". */
export async function idZnajomych(jaId: number): Promise<number[]> {
  const { obserwuje, obserwujaMnie } = await relacje(jaId)
  return [...obserwuje].filter((id) => obserwujaMnie.has(id))
}

type WpisZBazy = {
  id: number
  typ: FeedWpis['typ']
  tresc: string
  postac: string | null
  ikonaUrl: string | null
  itemy: string[]
  createdAt: Date
  autor: { id: number; nick: string; kolor: string | null; avatar: string | null; ja: boolean }
  lajki: { graczId: number }[]
}

const doWpisu = (w: WpisZBazy, jaId?: number): FeedWpis => ({
  id: w.id,
  typ: w.typ,
  tresc: w.tresc,
  postac: w.postac,
  ikonaUrl: w.ikonaUrl,
  itemy: w.itemy,
  czas: w.createdAt.toISOString(),
  autor: {
    id: w.autor.id,
    nick: w.autor.nick,
    kolor: w.autor.kolor,
    avatar: w.autor.avatar,
    ja: w.autor.ja,
  },
  lajki: w.lajki.length,
  polubione: jaId ? w.lajki.some((l) => l.graczId === jaId) : false,
})

/**
 * Feed aktywności. `'znajomi'` = wpisy znajomych (obserwacja w obie strony) i Twoje,
 * `'global'` = cała społeczność. To dwa osobne feedy, bo odpowiadają na dwa różne pytania:
 * „co u moich" i „co się w ogóle dzieje".
 */
export async function getFeed(zakres: ZakresFeedu = 'global', ile = 30): Promise<FeedWpis[]> {
  const ja = await jaGracz()

  let autorzy: number[] | undefined
  if (zakres === 'znajomi') {
    if (!ja) return []
    autorzy = [...(await idZnajomych(ja.id)), ja.id]
  }

  const wpisy = await prisma.wpis.findMany({
    where: autorzy ? { autorId: { in: autorzy } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: ile,
    include: { autor: true, lajki: { select: { graczId: true } } },
  })

  return wpisy.map((w) => doWpisu(w, ja?.id))
}

export type GraczKarta = {
  id: number
  nick: string
  kolor: string | null
  avatar: string | null
  opis: string | null
  ja: boolean
  /** Ty obserwujesz jego. */
  obserwowany: boolean
  /** On obserwuje Ciebie. */
  obserwujeMnie: boolean
  /** Obie strony naraz — czyli znajomy. */
  znajomy: boolean
  obserwujacych: number
  wpisy: number
}

type GraczZBazy = {
  id: number
  nick: string
  kolor: string | null
  avatar: string | null
  opis: string | null
  ja: boolean
  _count: { obserwowany: number; wpisy: number }
}

const doKarty = (g: GraczZBazy, obs: Set<number>, obsMnie: Set<number>): GraczKarta => ({
  id: g.id,
  nick: g.nick,
  kolor: g.kolor,
  avatar: g.avatar,
  opis: g.opis,
  ja: g.ja,
  obserwowany: obs.has(g.id),
  obserwujeMnie: obsMnie.has(g.id),
  znajomy: obs.has(g.id) && obsMnie.has(g.id),
  obserwujacych: g._count.obserwowany,
  wpisy: g._count.wpisy,
})

const LICZNIKI = { _count: { select: { obserwowany: true, wpisy: true } } } as const

/** Wszyscy gracze + stan relacji z Tobą (do list znajomych, obserwowanych i sugestii). */
export async function getGracze(): Promise<GraczKarta[]> {
  const ja = await jaGracz()
  const [gracze, rel] = await Promise.all([
    prisma.gracz.findMany({ orderBy: { nick: 'asc' }, include: LICZNIKI }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie))
}

/**
 * Szukanie gracza po nicku lub opisie (bez rozróżniania wielkości liter).
 * Puste zapytanie = pusta lista: szukajka nie ma być drugą listą wszystkich graczy.
 */
export async function szukajGraczy(q: string, limit = 12): Promise<GraczKarta[]> {
  const fraza = q.trim()
  if (!fraza) return []

  const ja = await jaGracz()
  const [gracze, rel] = await Promise.all([
    prisma.gracz.findMany({
      where: {
        OR: [
          { nick: { contains: fraza, mode: 'insensitive' } },
          { opis: { contains: fraza, mode: 'insensitive' } },
        ],
      },
      orderBy: { nick: 'asc' },
      take: limit,
      include: LICZNIKI,
    }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie))
}

/** Liczniki do profilu i nagłówka Znajomych. */
export async function getLicznikiSpoleczne() {
  const ja = await jaGracz()
  if (!ja) return { obserwuje: 0, obserwujacych: 0, wpisy: 0, znajomi: 0 }
  const [obserwuje, obserwujacych, wpisy, znajomi] = await Promise.all([
    prisma.obserwacja.count({ where: { obserwujacyId: ja.id } }),
    prisma.obserwacja.count({ where: { obserwowanyId: ja.id } }),
    prisma.wpis.count({ where: { autorId: ja.id } }),
    idZnajomych(ja.id).then((ids) => ids.length),
  ])
  return { obserwuje, obserwujacych, wpisy, znajomi }
}

/** Ostatnia aktywność konkretnego gracza (domyślnie Twoja) — na stronę profilu. */
export async function getAktywnosc(graczId?: number, ile = 6): Promise<FeedWpis[]> {
  const ja = await jaGracz()
  const id = graczId ?? ja?.id
  if (!id) return []
  const wpisy = await prisma.wpis.findMany({
    where: { autorId: id },
    orderBy: { createdAt: 'desc' },
    take: ile,
    include: { autor: true, lajki: { select: { graczId: true } } },
  })
  return wpisy.map((w) => doWpisu(w, ja?.id))
}
