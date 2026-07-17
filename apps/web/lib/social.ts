import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Społeczność: feed, obserwowanie, lajki. Wszystko leży w bazie (Gracz, Obserwacja, Wpis, Lajk),
 * więc obserwowanie i polubienia są TRWAŁE — nie są stanem komponentu jak w poprzedniej wersji.
 *
 * Kim jest „ja” (zalogowany, dla gościa `null`) rozstrzyga lib/konto — gość nie ma znajomych
 * ani wpisów, więc widzi puste liczniki i pusty feed znajomych, ale globalny feed dalej działa.
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
    // „To ja" = gracz zalogowanego użytkownika, a NIE kolumna `Gracz.ja` (ta oznacza na
    // sztywno jedno konto właściciela). Gość nie ma tożsamości, więc dla niego zawsze false
    // — inaczej klik w tamto konto odsyłał go na własny, pusty /profil.
    ja: jaId != null && w.autor.id === jaId,
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
  const ja = await mojGracz()

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

const doKarty = (
  g: GraczZBazy,
  obs: Set<number>,
  obsMnie: Set<number>,
  jaId?: number,
): GraczKarta => ({
  id: g.id,
  nick: g.nick,
  kolor: g.kolor,
  avatar: g.avatar,
  opis: g.opis,
  ja: jaId != null && g.id === jaId,
  obserwowany: obs.has(g.id),
  obserwujeMnie: obsMnie.has(g.id),
  znajomy: obs.has(g.id) && obsMnie.has(g.id),
  obserwujacych: g._count.obserwowany,
  wpisy: g._count.wpisy,
})

const LICZNIKI = { _count: { select: { obserwowany: true, wpisy: true } } } as const

/** Wszyscy gracze + stan relacji z Tobą (do list znajomych, obserwowanych i sugestii). */
export async function getGracze(): Promise<GraczKarta[]> {
  const ja = await mojGracz()
  const [gracze, rel] = await Promise.all([
    prisma.gracz.findMany({ orderBy: { nick: 'asc' }, include: LICZNIKI }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie, ja?.id))
}

/**
 * Szukanie gracza po nicku lub opisie (bez rozróżniania wielkości liter).
 * Puste zapytanie = pusta lista: szukajka nie ma być drugą listą wszystkich graczy.
 */
export async function szukajGraczy(q: string, limit = 12): Promise<GraczKarta[]> {
  const fraza = q.trim()
  if (!fraza) return []

  const ja = await mojGracz()
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
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie, ja?.id))
}

/**
 * Jeden gracz po nicku + jego wpisy — pod stronę /gracz/[nick].
 * Nick szukany bez rozróżniania wielkości liter, żeby /gracz/voidking też trafiał
 * (linki z czatu i powiadomień biorą nick z tekstu, nie z bazy).
 */
export async function getGraczPoNicku(
  nick: string,
): Promise<{ gracz: GraczKarta; wpisy: FeedWpis[] } | null> {
  const ja = await mojGracz()
  const [g, rel] = await Promise.all([
    prisma.gracz.findFirst({
      where: { nick: { equals: nick, mode: 'insensitive' } },
      include: LICZNIKI,
    }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  if (!g) return null

  const wpisy = await prisma.wpis.findMany({
    where: { autorId: g.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { autor: true, lajki: { select: { graczId: true } } },
  })

  return {
    gracz: doKarty(g, rel.obserwuje, rel.obserwujaMnie, ja?.id),
    wpisy: wpisy.map((w) => doWpisu(w, ja?.id)),
  }
}

/**
 * Znajomi DANEGO gracza (obserwacja w obie strony), do panelu na jego profilu.
 * Osobno od `getGracze()`, bo tamto liczy relacje względem CIEBIE, a tu chodzi o jego.
 */
export async function getZnajomychGracza(graczId: number, ile = 6): Promise<GraczKarta[]> {
  const ja = await mojGracz()
  const [ich, rel] = await Promise.all([relacje(graczId), ja ? relacje(ja.id) : PUSTE_RELACJE])
  const znajomiId = [...ich.obserwuje].filter((id) => ich.obserwujaMnie.has(id))
  if (znajomiId.length === 0) return []

  const gracze = await prisma.gracz.findMany({
    where: { id: { in: znajomiId } },
    orderBy: { nick: 'asc' },
    take: ile,
    include: LICZNIKI,
  })
  // Relacja w karcie zostaje MOJA (żeby przycisk „Obserwuj" mówił prawdę o mnie i nim).
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie, ja?.id))
}

/**
 * Sama karta gracza po nicku — BEZ jego wpisów.
 *
 * Osobno od `getGraczPoNicku`, bo tamto dociąga jeszcze 20 wpisów razem z autorami
 * i lajkami. Dymek na hover nic z tego nie pokazuje, a zapytanie kosztowało ~1 s —
 * przy najeździe kursorem to wieczność.
 */
export async function getWizytowke(nick: string): Promise<GraczKarta | null> {
  const ja = await mojGracz()
  const [g, rel] = await Promise.all([
    prisma.gracz.findFirst({
      where: { nick: { equals: nick, mode: 'insensitive' } },
      include: LICZNIKI,
    }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  if (!g) return null
  return doKarty(g, rel.obserwuje, rel.obserwujaMnie, ja?.id)
}

/**
 * Kto obserwuje danego gracza / kogo on obserwuje — pod klikalne liczniki na profilu.
 * Relacja w zwróconych kartach jest MOJA (żeby „Obserwuj" mówił prawdę o mnie i o nich),
 * a nie jego — tak samo jak w `getZnajomychGracza`.
 */
export async function getObserwujacych(graczId: number, ile = 24): Promise<GraczKarta[]> {
  const ja = await mojGracz()
  const [obs, rel] = await Promise.all([
    prisma.obserwacja.findMany({
      where: { obserwowanyId: graczId },
      select: { obserwujacyId: true },
    }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  return kartyPoId(
    obs.map((o) => o.obserwujacyId),
    rel,
    ja?.id,
    ile,
  )
}

export async function getObserwowanych(graczId: number, ile = 24): Promise<GraczKarta[]> {
  const ja = await mojGracz()
  const [obs, rel] = await Promise.all([
    prisma.obserwacja.findMany({
      where: { obserwujacyId: graczId },
      select: { obserwowanyId: true },
    }),
    ja ? relacje(ja.id) : PUSTE_RELACJE,
  ])
  return kartyPoId(
    obs.map((o) => o.obserwowanyId),
    rel,
    ja?.id,
    ile,
  )
}

/** Wspólny ogon obu funkcji wyżej: id → karty graczy. */
async function kartyPoId(
  ids: number[],
  rel: { obserwuje: Set<number>; obserwujaMnie: Set<number> },
  jaId: number | undefined,
  ile: number,
): Promise<GraczKarta[]> {
  if (ids.length === 0) return []
  const gracze = await prisma.gracz.findMany({
    where: { id: { in: ids } },
    orderBy: { nick: 'asc' },
    take: ile,
    include: LICZNIKI,
  })
  return gracze.map((g) => doKarty(g, rel.obserwuje, rel.obserwujaMnie, jaId))
}

/** Liczniki do profilu i nagłówka Znajomych. */
export async function getLicznikiSpoleczne() {
  const ja = await mojGracz()
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
  const ja = await mojGracz()
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
