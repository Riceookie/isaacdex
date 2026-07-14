'use server'

import { prisma } from '@isaacdex/db'
import { revalidatePath } from 'next/cache'
import { szukajGraczy, type GraczKarta } from '@/lib/social'
import { mojGracz } from '@/lib/konto'

/**
 * Akcje społecznościowe. Zapisują do bazy (nie do stanu komponentu), więc obserwowanie
 * i lajki przeżywają odświeżenie strony.
 *
 * Piszemy WYŁĄCZNIE jako zalogowany gracz (`mojGracz`), nigdy jako właściciel pokazywany
 * gościom — inaczej przypadkowy gość obserwowałby i lajkował cudzym kontem.
 */

async function odswiez() {
  revalidatePath('/')
  revalidatePath('/znajomi')
  revalidatePath('/profil')
}

export async function przelaczObserwowanie(graczId: number) {
  const ja = await mojGracz()
  if (!ja || ja.id === graczId) return { obserwowany: false }

  const klucz = { obserwujacyId_obserwowanyId: { obserwujacyId: ja.id, obserwowanyId: graczId } }
  const juz = await prisma.obserwacja.findUnique({ where: klucz })

  if (juz) {
    await prisma.obserwacja.delete({ where: klucz })
  } else {
    await prisma.obserwacja.create({
      data: { obserwujacyId: ja.id, obserwowanyId: graczId },
    })
  }

  await odswiez()
  return { obserwowany: !juz }
}

/**
 * Szukanie graczy dla szukajki (client component woła to przy pisaniu).
 * Szukamy w bazie, a nie filtrujemy listy w przeglądarce — dzięki temu szukajka
 * zadziała tak samo, gdy graczy będzie tysiąc, a nie piętnastu.
 */
export async function szukajGraczyAkcja(q: string): Promise<GraczKarta[]> {
  return szukajGraczy(q)
}

export async function przelaczLajk(wpisId: number) {
  const ja = await mojGracz()
  if (!ja) return { polubione: false }

  const klucz = { wpisId_graczId: { wpisId, graczId: ja.id } }
  const juz = await prisma.lajk.findUnique({ where: klucz })

  if (juz) {
    await prisma.lajk.delete({ where: klucz })
  } else {
    await prisma.lajk.create({ data: { wpisId, graczId: ja.id } })
  }

  await odswiez()
  return { polubione: !juz }
}
