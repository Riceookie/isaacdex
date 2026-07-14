import { prisma } from '@isaacdex/db'
import { uzytkownik } from '@/lib/supabase/serwer'

/**
 * Kim jest „ja”. Dwie różne odpowiedzi, celowo:
 *
 *  - `mojGracz()`  — gracz ZALOGOWANEGO użytkownika. Null dla gościa. Tego pilnujemy przy
 *                    zapisie: gość nie obserwuje i nie lajkuje cudzym kontem.
 *  - `jaGracz()`   — kogo POKAZAĆ. Dla gościa to właściciel apki (`ja = true`), żeby dało się
 *                    ją obejrzeć bez zakładania konta (i żeby recenzent zobaczył pełny profil).
 *
 * Rozdzielenie „kogo widzę” od „kim piszę” to cała różnica między apką do oglądania
 * a apką, w której można coś popsuć cudzą ręką.
 */

/** Gracz zalogowanego użytkownika. Null = gość. */
export async function mojGracz() {
  const user = await uzytkownik()
  if (!user) return null
  return prisma.gracz.findUnique({ where: { userId: user.id } })
}

/** Kogo pokazujemy: zalogowanego, a dla gościa — właściciela apki. */
export async function jaGracz() {
  return (await mojGracz()) ?? prisma.gracz.findFirst({ where: { ja: true } })
}

/** Czy w ogóle da się teraz coś zapisać (czyli: czy ktoś jest zalogowany). */
export async function czyZalogowany() {
  return (await mojGracz()) !== null
}

/**
 * Gracz zakładany przy pierwszym logowaniu. Nick musi być unikalny (widać go w feedzie),
 * więc przy kolizji dokładamy licznik zamiast wywalać rejestrację.
 */
export async function zalozGracza(userId: string, nick: string) {
  const istnieje = await prisma.gracz.findUnique({ where: { userId } })
  if (istnieje) return istnieje

  let kandydat = nick
  for (let i = 2; await prisma.gracz.findUnique({ where: { nick: kandydat } }); i++) {
    kandydat = `${nick}${i}`
  }

  return prisma.gracz.create({
    data: { nick: kandydat, userId, avatar: 'Isaac', kolor: '#e5544b' },
  })
}
