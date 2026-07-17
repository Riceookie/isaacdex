import { cache } from 'react'
import { prisma } from '@isaacdex/db'
import { uzytkownik } from '@/lib/supabase/serwer'

/**
 * Kim jest „ja”. Dla gościa: NIKIM.
 *
 * `mojGracz()` zwraca gracza zalogowanego użytkownika, a dla gościa `null`. Wcześniej istniał
 * jeszcze `jaGracz()`, który gościowi podstawiał właściciela apki („żeby było co oglądać”) —
 * ale to pokazywało cudze osiągnięcia jako własne. Teraz gość nie ma tożsamości: jego profil,
 * statystyki, znajomi i achievementy są puste, a każda taka zakładka zaprasza do logowania.
 * Wspólne dane (globalny feed, czat globalny, encyklopedia) zostają widoczne bez konta.
 */

/**
 * Gracz zalogowanego użytkownika. Null = gość.
 * `cache()` = wynik liczony RAZ na render — layout i strona wołają `mojGracz()` po kilka razy,
 * a bez tego każde wywołanie robiło osobny `getUser()` (round-trip do Supabase) i zapytanie do bazy.
 */
export const mojGracz = cache(async () => {
  const user = await uzytkownik()
  if (!user) return null
  return prisma.gracz.findUnique({ where: { userId: user.id } })
})

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
