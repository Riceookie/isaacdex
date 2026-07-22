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
  odpowiedzNaId?: number | null,
): Promise<{ ok: true } | { ok: false; powod: string }> {
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: t('czat.bladZalogujByPisac') }

  const czysta = tresc.trim().slice(0, MAX_DLUGOSC)
  if (!czysta && !obrazekUrl) return { ok: false, powod: t('czat.bladPustaWiadomosc') }

  const kanal = await kanalDlaSlugu(slug)
  if (!kanal) return { ok: false, powod: t('czat.bladBrakKanalu') }

  // Odpowiadać można tylko na wiadomość Z TEGO SAMEGO kanału — inaczej dałoby się przez ID
  // wkleić cytat z cudzej rozmowy. Nieznane/obce ID po cichu ignorujemy (zwykła wiadomość).
  let odpowiedz: number | null = null
  if (odpowiedzNaId != null) {
    const cel = await prisma.wiadomosc.findUnique({
      where: { id: odpowiedzNaId },
      select: { kanal: true },
    })
    if (cel?.kanal === kanal) odpowiedz = odpowiedzNaId
  }

  await prisma.wiadomosc.create({
    data: {
      kanal,
      autorId: ja.id,
      tresc: czysta,
      obrazekUrl: obrazekUrl ?? null,
      odpowiedzNaId: odpowiedz,
    },
  })

  return { ok: true }
}

/**
 * Kasowanie wiadomości — DLA WSZYSTKICH, ale MIĘKKO: zostawiamy nagrobek „X usunął
 * wiadomość" (jak na Discordzie), zamiast usuwać wiersz. Realtime rozniesie UPDATE.
 * Wcześniej „×" tylko chował wiadomość lokalnie: znikała u Ciebie, a u innych zostawała.
 *
 * Skasować może AUTOR albo właściciel apki (`ja` — moderacja własnej piwnicy). Treść,
 * obrazek i reakcje CZYŚCIMY (nic nie przecieka), a `usunietaPrzezId` mówi, kto skasował
 * — UI pokaże „Ty" temu, kto to zrobił, a nick pozostałym. Odpowiedzi na tę wiadomość
 * zostają: ich cytat sam zamienia się w „wiadomość usunięta" (bo oryginał ma `usunieta`).
 */
export async function usunWiadomosc(
  wiadomoscId: number,
): Promise<{ ok: true } | { ok: false; powod: string }> {
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: t('czat.bladZalogujByPisac') }

  const wiad = await prisma.wiadomosc.findUnique({
    where: { id: wiadomoscId },
    select: { autorId: true, usunieta: true },
  })
  if (!wiad) return { ok: false, powod: t('czat.bladBrakWiadomosci') }
  if (wiad.autorId !== ja.id && !ja.ja) return { ok: false, powod: t('czat.bladNieTwoja') }
  if (wiad.usunieta) return { ok: true } // już nagrobek — nic do roboty

  // Reakcje kasujemy osobno (nie kaskadą FK), bo wiersz wiadomości zostaje jako nagrobek.
  await prisma.$transaction([
    prisma.reakcjaWiadomosci.deleteMany({ where: { wiadomoscId } }),
    prisma.wiadomosc.update({
      where: { id: wiadomoscId },
      data: {
        usunieta: true,
        usunietaPrzezId: ja.id,
        tresc: '',
        obrazekUrl: null,
      },
    }),
  ])
  return { ok: true }
}

/**
 * Edycja własnej wiadomości. Tylko AUTOR i tylko treść (obrazka się nie podmienia). Ustawia
 * `edytowana`, żeby UI mógł dopisać „(edytowano)" — jak na Discordzie.
 */
export async function edytujWiadomosc(
  wiadomoscId: number,
  tresc: string,
): Promise<{ ok: true } | { ok: false; powod: string }> {
  const t = tlumacz()
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: t('czat.bladZalogujByPisac') }

  const czysta = tresc.trim().slice(0, MAX_DLUGOSC)
  if (!czysta) return { ok: false, powod: t('czat.bladPustaWiadomosc') }

  const wiad = await prisma.wiadomosc.findUnique({
    where: { id: wiadomoscId },
    select: { autorId: true },
  })
  if (!wiad) return { ok: false, powod: t('czat.bladBrakWiadomosci') }
  if (wiad.autorId !== ja.id) return { ok: false, powod: t('czat.bladNieTwoja') }

  await prisma.wiadomosc.update({
    where: { id: wiadomoscId },
    data: { tresc: czysta, edytowana: true },
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
