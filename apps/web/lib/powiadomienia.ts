import 'server-only'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Powiadomienia z PRAWDZIWYCH zdarzeń.
 *
 * Wcześniej dzwonek miał wpisaną w kod listę („VoidKing zaczął Cię obserwować", licznik 2),
 * identyczną u każdego i przy każdym wejściu. Teraz bierzemy to, co faktycznie zaszło:
 * nowe obserwacje (tabela `Obserwacja`) i wiadomości prywatne do Ciebie (`Wiadomosc`).
 *
 * Czego tu NIE ma: lajków — `Lajk` nie zapisuje czasu, więc nie da się powiedzieć „kiedy",
 * a powiadomienie bez „kiedy" nie ma sensu. Wróci, gdy tabela dostanie znacznik czasu.
 *
 * Czego tu też NIE ma: gotowych zdań. To moduł danych, a nie widok — język zna dopiero
 * przeglądarka (ciasteczko + provider), więc zamiast „zaczyna Cię obserwować" oddajemy
 * sam `typ`, a zdanie składa dzwonek (`spolecznosc.powiadomienie*`). Typ i tak wyznaczał
 * treść jeden do jednego, więc osobne pole `tekst` było tylko duplikatem — po polsku.
 */

export type Powiadomienie = {
  id: string
  /** Rodzaj zdarzenia — z niego widok bierze i ikonę, i przetłumaczone zdanie. */
  typ: 'follow' | 'wiadomosc'
  /** Kto — do podlinkowania profilu. */
  autor: string
  /** ISO; „ile temu" liczy już przeglądarka. */
  czas: string
}

const ILE = 12

export async function getPowiadomienia(): Promise<Powiadomienie[]> {
  const ja = await mojGracz()
  if (!ja) return []

  // Rozmowy prywatne rozpoznajemy po nazwie kanału: „dm:<mniejsze>-<większe>".
  const wzorceDm = { startsWith: 'dm:' }

  const [obserwacje, wiadomosci] = await Promise.all([
    prisma.obserwacja.findMany({
      where: { obserwowanyId: ja.id },
      orderBy: { createdAt: 'desc' },
      take: ILE,
      include: { obserwujacy: { select: { nick: true } } },
    }),
    prisma.wiadomosc.findMany({
      where: { kanal: wzorceDm, autorId: { not: ja.id } },
      orderBy: { utworzono: 'desc' },
      take: ILE * 3, // z zapasem — odsiewamy cudze rozmowy niżej
      select: { id: true, kanal: true, utworzono: true, autor: { select: { nick: true } } },
    }),
  ])

  // Do MNIE, czyli tylko te kanały, w których jestem jedną ze stron.
  const mojeDm = wiadomosci.filter((w) => {
    const m = w.kanal.match(/^dm:(\d+)-(\d+)$/)
    return m != null && (Number(m[1]) === ja.id || Number(m[2]) === ja.id)
  })

  const lista: Powiadomienie[] = [
    ...obserwacje.map((o) => ({
      id: `follow-${o.obserwujacyId}`,
      typ: 'follow' as const,
      autor: o.obserwujacy.nick,
      czas: o.createdAt.toISOString(),
    })),
    ...mojeDm.map((w) => ({
      id: `wiad-${w.id}`,
      typ: 'wiadomosc' as const,
      autor: w.autor.nick,
      czas: w.utworzono.toISOString(),
    })),
  ]

  return lista.sort((a, b) => b.czas.localeCompare(a.czas)).slice(0, ILE)
}
