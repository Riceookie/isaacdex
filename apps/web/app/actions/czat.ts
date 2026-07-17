'use server'

import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'
import { kanalDlaSlugu } from '@/lib/wiadomosci'
import { KANALY, MAX_DLUGOSC } from '@/lib/czat'

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
  const ja = await mojGracz()
  if (!ja) return { ok: false, powod: 'Zaloguj się, aby pisać.' }

  const czysta = tresc.trim().slice(0, MAX_DLUGOSC)
  if (!czysta && !obrazekUrl) return { ok: false, powod: 'Pusta wiadomość.' }

  const kanal = await kanalDlaSlugu(slug)
  if (!kanal) return { ok: false, powod: 'Nie ma takiego kanału.' }

  // Ogłoszenia wygłasza Dogma. Blokadę trzyma serwer, nie tylko schowany input.
  if (KANALY.some((k) => k.slug === kanal && k.tylkoOdczyt)) {
    return { ok: false, powod: 'W tym kanale mówi tylko Dogma.' }
  }

  await prisma.wiadomosc.create({
    data: { kanal, autorId: ja.id, tresc: czysta, obrazekUrl: obrazekUrl ?? null },
  })

  return { ok: true }
}
