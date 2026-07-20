'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  CIASTECZKO_JEZYKA,
  czyJezyk,
  JEZYK_DOMYSLNY,
  MAKS_WIEK_JEZYKA,
  type Jezyk,
} from '@/lib/i18n/jezyk'

/**
 * Zmiana języka interfejsu.
 *
 * Akcja serwerowa, a nie `document.cookie` z klienta: ciasteczko musi być ustawione ZANIM
 * serwer wyrenderuje stronę na nowo, inaczej pierwsze odświeżenie wróciłoby w starym języku.
 * `revalidatePath('/', 'layout')` czyści cache całego drzewa — przetłumaczone są też
 * komponenty serwerowe, więc odświeżenie samej strony ustawień by nie wystarczyło.
 */
export async function ustawJezyk(jezyk: Jezyk) {
  const wybrany: Jezyk = czyJezyk(jezyk) ? jezyk : JEZYK_DOMYSLNY

  cookies().set(CIASTECZKO_JEZYKA, wybrany, {
    maxAge: MAKS_WIEK_JEZYKA,
    path: '/',
    sameSite: 'lax',
    // Bez `httpOnly`: to preferencja wyglądu, nie sekret, a skrypt tematu w <head>
    // musi móc ją przeczytać, zanim React w ogóle wystartuje.
    httpOnly: false,
  })

  revalidatePath('/', 'layout')
}
