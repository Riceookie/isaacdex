'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@isaacdex/db'
import { mojGracz } from '@/lib/konto'

/**
 * Trzy pieczęcie Sekretnego Pokoju. Odpowiedzi żyją WYŁĄCZNIE tu, na serwerze — nigdy nie
 * trafiają do bundla przeglądarki, więc sekretu nie da się „podejrzeć w źródle". Klient woła
 * `sprawdzKrok(krok, odpowiedz)` i dostaje z powrotem tylko `{ ok }` (plus `koniec` na finale) —
 * nie widzi wzorców. Ostatnia pieczęć nadaje tytuł „Keeper", więc nagrody nie da się dostać bez
 * poprawnego imienia (kto zna trzecią odpowiedź, i tak sekret rozwiązał).
 *
 * Łuk zagadek odsłania, czym jest ta postać: (1) z czego jest — MONETY, (2) czego strzeże —
 * SKLEP, (3) jej prawdziwe imię — KEEPER (zbombardowany Shopkeeper zmienia się w Keepera).
 * Sprawdzamy pobłażliwie: normalizujemy do samych liter ASCII (ł→l, diakrytyki zdejmowane),
 * a potem szukamy podciągu — łapie warianty i PL, i EN.
 */
const PIECZECIE: RegExp[] = [
  /coin|money|gold|penn|cash|bilon|monet|zlot|grosz/, // 1: zrobiony z monet
  /shop|store|market|sklep/, // 2: strzeże sklepu
  /keeper/, // 3: prawdziwe imię (shopkeeper też zawiera „keeper")
]

/** Do samych małych liter ASCII: zdejmij diakrytyki (ą→a, ó→o…), ł→l, wywal resztę. */
function znormalizuj(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // zdejmij złożone diakrytyki (ą→a, ć→c, ó→o…)
    .replace(/ł/g, 'l') // ł nie rozkłada się w NFD
    .replace(/[^a-z]/g, '')
}

export async function sprawdzKrok(
  krok: number,
  odpowiedz: string,
): Promise<{ ok: boolean; koniec?: boolean }> {
  const ja = await mojGracz()
  // Sekretów nie ma komu nadawać gościowi — challenge i tak widzi tylko zalogowany.
  if (!ja) return { ok: false }

  const wzor = PIECZECIE[krok]
  if (!wzor) return { ok: false }
  if (!wzor.test(znormalizuj(odpowiedz))) return { ok: false }

  // Ostatnia pieczęć → nadanie tytułu (idempotentnie).
  if (krok === PIECZECIE.length - 1) {
    if (!ja.sekretOdkryty) {
      await prisma.gracz.update({ where: { id: ja.id }, data: { sekretOdkryty: true } })
      // Tytuł „Keeper" wchodzi do puli odznak (nagłówek profilu, Pulpit) — renderuje je layout.
      revalidatePath('/', 'layout')
    }
    return { ok: true, koniec: true }
  }

  return { ok: true }
}
