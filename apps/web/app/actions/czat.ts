'use server'

import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import { czyMojKanal, kanalDlaSlugu } from '@/lib/wiadomosci'
import { MAX_DLUGOSC } from '@/lib/czat'
import { tlumacz } from '@/lib/i18n/serwer'

/**
 * Wysłanie wiadomości.
 *
 * Zapis idzie Prismą (rola właściciela tabeli), a nie kluczem anon z przeglądarki —
 * `Wiadomosc` ma politykę tylko na SELECT, więc z przeglądarki da się czytać, ale nie pisać.
 * Dzięki temu wszystkie reguły (kto, gdzie, jak długo) są w jednym miejscu: tutaj.
 *
 * Realtime rozniesie INSERT do wszystkich w kanale sam — nie ma tu żadnego rozgłaszania.
 */
export async function wyslijWiadomosc(
  slug: string,
  tresc: string,
  obrazekUrl?: string | null,
): Promise<{ ok: true } | { ok: false; powod: string }> {
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: t('czat.bladZalogujByPisac') }

  const czysta = tresc.trim().slice(0, MAX_DLUGOSC)
  if (!czysta && !obrazekUrl) return { ok: false, powod: t('czat.bladPustaWiadomosc') }

  const kanal = await kanalDlaSlugu(slug)
  if (!kanal) return { ok: false, powod: t('czat.bladBrakKanalu') }

  await prisma.wiadomosc.create({
    data: { kanal, autorId: ja.id, tresc: czysta, obrazekUrl: obrazekUrl ?? null },
  })

  return { ok: true }
}

/**
 * Reakcja pod wiadomością — kliknięcie dodaje, ponowne zdejmuje.
 *
 * Reakcje żyły dotąd w stanie komponentu: znikały po odświeżeniu i nikt poza Tobą ich nie
 * widział. Teraz są wierszem w bazie, a klucz (wiadomość, gracz, ikona) sam pilnuje, żeby
 * jeden gracz nie dołożył tej samej ikony dwa razy.
 */
export async function przelaczReakcje(
  wiadomoscId: number,
  ikona: string,
): Promise<{ ok: true; dodana: boolean } | { ok: false; powod: string }> {
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: t('czat.bladZalogujByReagowac') }
  // Cyfry są dozwolone, bo reakcją może być naklejka z katalogu („c105", „t1"), ale token
  // wciąż musi zaczynać się od litery — kształt sprawdzamy tu, sens przy renderowaniu.
  if (!/^[a-zA-Z][a-zA-Z0-9]{0,23}$/.test(ikona))
    return { ok: false, powod: t('czat.bladNieznanaReakcja') }

  // Reagować można tylko tam, gdzie w ogóle wolno Ci czytać — kanał wiadomości musi być
  // jednym z Twoich (publiczny albo Twój DM).
  const wiad = await prisma.wiadomosc.findUnique({
    where: { id: wiadomoscId },
    select: { kanal: true },
  })
  if (!wiad) return { ok: false, powod: t('czat.bladBrakWiadomosci') }
  if (!(await czyMojKanal(wiad.kanal, ja.id)))
    return { ok: false, powod: t('czat.bladNieTwojKanal') }

  const klucz = { wiadomoscId_graczId_ikona: { wiadomoscId, graczId: ja.id, ikona } }
  const istnieje = await prisma.reakcjaWiadomosci.findUnique({ where: klucz })

  if (istnieje) {
    await prisma.reakcjaWiadomosci.delete({ where: klucz })
    return { ok: true, dodana: false }
  }
  await prisma.reakcjaWiadomosci.create({ data: { wiadomoscId, graczId: ja.id, ikona } })
  return { ok: true, dodana: true }
}
