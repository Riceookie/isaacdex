import 'server-only'
import { prisma, TypWpisu } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Powiadomienia z PRAWDZIWYCH zdarzeń.
 *
 * Wcześniej dzwonek miał wpisaną w kod listę („VoidKing zaczął Cię obserwować", licznik 2),
 * identyczną u każdego i przy każdym wejściu. Teraz bierzemy to, co faktycznie zaszło:
 *  - nowe obserwacje (`Obserwacja.createdAt`),
 *  - wiadomości prywatne do Ciebie (`Wiadomosc.utworzono`),
 *  - Twoje achievementy ze Steama (`SteamAchievement.dataOdblokowania`),
 *  - kamienie milowe obserwowanych graczy (`Wpis.createdAt`: UNLOCK / BOSS / RUN).
 *
 * Czego tu NIE ma i DLACZEGO:
 *  - lajków — `Lajk` to sam klucz złożony (wpisId, graczId), bez znacznika czasu. Nie da się
 *    powiedzieć „kiedy", a powiadomienie bez „kiedy" trafiłoby w losowe miejsce listy
 *    posortowanej po czasie. Wróci, gdy tabela dostanie `createdAt`.
 *  - reakcji pod wiadomościami — `ReakcjaWiadomosci` ma ten sam problem (klucz złożony,
 *    zero daty).
 *  - completion marks — `CompletionMark.data` ISTNIEJE, ale marki wpisujesz sobie sam,
 *    ręcznie, w tej samej apce. Powiadamianie Cię o Twoim własnym kliknięciu sprzed
 *    sekundy to szum, nie informacja. Achievementy Steama zostają, bo te przychodzą
 *    z zewnątrz (sync) i faktycznie bywają odkryciem.
 *  - wpisów typu TEKST od obserwowanych — `tresc` jest wtedy dowolnie długim postem,
 *    a nie nazwą, więc nie zmieści się w jednej linijce wiersza. Są w feedzie.
 *
 * Czego tu też NIE ma: gotowych zdań. To moduł danych, a nie widok — język zna dopiero
 * przeglądarka (ciasteczko + provider), więc zamiast „zaczyna Cię obserwować" oddajemy
 * sam `typ`, a zdanie składa dzwonek (`spolecznosc.powiadomienie*`).
 */

export type TypPowiadomienia =
  | 'follow'
  | 'wiadomosc'
  | 'achievement'
  | 'achievementRzadki'
  | 'znajomyUnlock'
  | 'znajomyBoss'
  | 'znajomyRun'

export type Powiadomienie = {
  id: string
  /** Rodzaj zdarzenia — z niego widok bierze i ikonę, i przetłumaczone zdanie. */
  typ: TypPowiadomienia
  /** Kto — do podlinkowania profilu. */
  autor: string
  /** Avatar autora (nazwa postaci albo ścieżka do obrazka) — portret w wierszu. */
  avatar: string | null
  /** To Ty (własny achievement) — zdanie leci w 2. osobie, a link na /profil. */
  ja: boolean
  /** ISO; „ile temu” liczy już przeglądarka. */
  czas: string
  /** Nazwa z gry (achievement / boss / opis runu). Zostaje po angielsku w obu językach. */
  detal?: string
  /** Prawdziwa ikona achievementu ze Steama — lepszy portret niż avatar, gdy jest. */
  ikonaUrl?: string
}

const ILE = 12
/** Rzadkość achievementu (globalny % graczy), poniżej której dostaje osobny, złoty wariant. */
const PROG_RZADKOSCI = 5
/** Sync Steama odblokowuje po kilkadziesiąt naraz — bez limitu zalałyby całą kartkę. */
const ILE_ACHIEVEMENTOW = 4
const ILE_ZNAJOMYCH = 6

/** UNLOCK/BOSS/RUN → typ powiadomienia. TEKST celowo nie ma mapowania (patrz nagłówek). */
const Z_WPISU = {
  [TypWpisu.UNLOCK]: 'znajomyUnlock',
  [TypWpisu.BOSS]: 'znajomyBoss',
  [TypWpisu.RUN]: 'znajomyRun',
} as const satisfies Partial<Record<TypWpisu, TypPowiadomienia>>

export async function getPowiadomienia(): Promise<Powiadomienie[]> {
  const ja = await mojGracz()
  if (!ja) return []

  // Rozmowy prywatne rozpoznajemy po nazwie kanału: „dm:<mniejsze>-<większe>".
  const wzorceDm = { startsWith: 'dm:' }

  const [obserwacje, wiadomosci, achievementy, obserwowani] = await Promise.all([
    prisma.obserwacja.findMany({
      where: { obserwowanyId: ja.id },
      orderBy: { createdAt: 'desc' },
      take: ILE,
      include: { obserwujacy: { select: { nick: true, avatar: true } } },
    }),
    prisma.wiadomosc.findMany({
      where: { kanal: wzorceDm, autorId: { not: ja.id } },
      orderBy: { utworzono: 'desc' },
      take: ILE * 3, // z zapasem — odsiewamy cudze rozmowy niżej
      select: {
        id: true,
        kanal: true,
        utworzono: true,
        autor: { select: { nick: true, avatar: true } },
      },
    }),
    // Bez podpiętego Steama nie ma czego pytać — `profilId` jest null i zapytanie
    // złapałoby cudze achievementy albo nic, zależnie od Prismy. Lepiej go nie wysyłać.
    ja.profilId == null
      ? []
      : prisma.steamAchievement.findMany({
          where: {
            profilId: ja.profilId,
            odblokowany: true,
            dataOdblokowania: { not: null },
          },
          orderBy: { dataOdblokowania: 'desc' },
          take: ILE_ACHIEVEMENTOW,
          select: {
            id: true,
            nazwa: true,
            ikonaUrl: true,
            globalnyProcent: true,
            dataOdblokowania: true,
          },
        }),
    prisma.obserwacja.findMany({
      where: { obserwujacyId: ja.id },
      select: { obserwowanyId: true },
    }),
  ])

  // Wpisy znajomych muszą poczekać na listę obserwowanych — to jedyne zapytanie zależne.
  const idZnajomych = obserwowani.map((o) => o.obserwowanyId)
  const wpisy = idZnajomych.length
    ? await prisma.wpis.findMany({
        where: {
          autorId: { in: idZnajomych },
          typ: { in: [TypWpisu.UNLOCK, TypWpisu.BOSS, TypWpisu.RUN] },
        },
        orderBy: { createdAt: 'desc' },
        take: ILE_ZNAJOMYCH,
        select: {
          id: true,
          typ: true,
          tresc: true,
          ikonaUrl: true,
          createdAt: true,
          autor: { select: { nick: true, avatar: true } },
        },
      })
    : []

  // Do MNIE, czyli tylko te kanały, w których jestem jedną ze stron.
  const mojeDm = wiadomosci.filter((w) => {
    const m = w.kanal.match(/^dm:(\d+)-(\d+)$/)
    return m != null && (Number(m[1]) === ja.id || Number(m[2]) === ja.id)
  })

  // Jedna linijka na rozmówcę, nie na wiadomość: piętnaście zdań pod rząd od tej samej
  // osoby to nadal jedna wiadomość do przeczytania. Lista jest już posortowana malejąco,
  // więc pierwszy trafiony wpis autora jest zarazem najnowszy.
  const widzianiRozmowcy = new Set<string>()
  const swiezeDm = mojeDm.filter((w) => {
    if (widzianiRozmowcy.has(w.autor.nick)) return false
    widzianiRozmowcy.add(w.autor.nick)
    return true
  })

  const lista: Powiadomienie[] = [
    ...obserwacje.map((o) => ({
      id: `follow-${o.obserwujacyId}`,
      typ: 'follow' as const,
      autor: o.obserwujacy.nick,
      avatar: o.obserwujacy.avatar,
      ja: false,
      czas: o.createdAt.toISOString(),
    })),
    ...swiezeDm.map((w) => ({
      id: `wiad-${w.id}`,
      typ: 'wiadomosc' as const,
      autor: w.autor.nick,
      avatar: w.autor.avatar,
      ja: false,
      czas: w.utworzono.toISOString(),
    })),
    ...achievementy.map((a) => ({
      id: `ach-${a.id}`,
      // `globalnyProcent` to Decimal (albo null) — null traktujemy jak „zwykły”,
      // bo brak danych o rzadkości nie jest dowodem rzadkości.
      typ:
        a.globalnyProcent != null && Number(a.globalnyProcent) < PROG_RZADKOSCI
          ? ('achievementRzadki' as const)
          : ('achievement' as const),
      autor: ja.nick,
      avatar: ja.avatar,
      ja: true,
      // `dataOdblokowania` odsiane w `where`, ale TS o tym nie wie — stąd `!`.
      czas: a.dataOdblokowania!.toISOString(),
      detal: a.nazwa,
      ikonaUrl: a.ikonaUrl ?? undefined,
    })),
    ...wpisy.map((w) => ({
      id: `wpis-${w.id}`,
      typ: Z_WPISU[w.typ as keyof typeof Z_WPISU],
      autor: w.autor.nick,
      avatar: w.autor.avatar,
      ja: false,
      czas: w.createdAt.toISOString(),
      detal: w.tresc,
      ikonaUrl: w.ikonaUrl ?? undefined,
    })),
  ]

  return lista.sort((a, b) => b.czas.localeCompare(a.czas)).slice(0, ILE)
}
