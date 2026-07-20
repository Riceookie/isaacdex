import { cookies } from 'next/headers'
import { CIASTECZKO_JEZYKA, czyJezyk, JEZYK_DOMYSLNY, type Jezyk } from './jezyk'
import { zrobTlumacza, type Tlumacz } from './slownik'

/**
 * Język i tłumacz po stronie serwera — dla komponentów serwerowych i akcji.
 *
 * `cookies()` wymusza render dynamiczny, ale to i tak nic nie zmienia: strony, które
 * wołają te funkcje, są już `force-dynamic` (czytają zalogowanego gracza z bazy).
 */
export function jezykSerwera(): Jezyk {
  const c = cookies().get(CIASTECZKO_JEZYKA)?.value
  return czyJezyk(c) ? c : JEZYK_DOMYSLNY
}

export function tlumacz(): Tlumacz {
  return zrobTlumacza(jezykSerwera())
}
