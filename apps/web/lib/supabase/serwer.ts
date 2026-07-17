import { cache } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { konfiguracjaSupabase, logowanieDziala } from '@/lib/supabase/konfiguracja'

/**
 * Klient Supabase po stronie serwera (komponenty serwerowe, server actions, route handlery).
 * Sesja siedzi w ciasteczkach, więc czyta ją każdy render — nie trzeba jej przekazywać w propsach.
 *
 * Komponenty serwerowe nie mogą pisać ciasteczek; odświeżaniem sesji zajmuje się middleware,
 * dlatego zapis tutaj jest celowo połknięty (patrz middleware.ts).
 */
export async function supabaseSerwer() {
  const ciasteczka = await cookies()
  const konfiguracja = konfiguracjaSupabase()

  // Wołający sprawdza konfigurację przed użyciem (patrz actions/auth.ts). Jeśli tu dotarł mimo
  // zepsutych kluczy, lepiej wyłożyć się z nazwą przyczyny niż wysyłać do Supabase śmieci.
  if (!konfiguracja.ok) {
    throw new Error(`Supabase nieskonfigurowany (${konfiguracja.powod})`)
  }

  return createServerClient(konfiguracja.url, konfiguracja.klucz, {
    cookies: {
      getAll: () => ciasteczka.getAll(),
      setAll: (doUstawienia) => {
        try {
          doUstawienia.forEach(({ name, value, options }) => ciasteczka.set(name, value, options))
        } catch {
          // Render komponentu serwerowego — sesję odświeży middleware.
        }
      },
    },
  })
}

/**
 * Zalogowany użytkownik albo null. Jedyne źródło prawdy o tym, kim jesteś.
 * `cache()` dedupuje `getUser()` (round-trip do Supabase Auth) do JEDNEGO na render —
 * bez tego layout + strona pytały serwer auth kilka razy przy każdej nawigacji.
 *
 * Pyta o to KAŻDA strona (layout), więc zepsuta konfiguracja nie może stąd rzucać — apka
 * ma być oglądalna bez konta, a nie zwracać 500 na wszystkim. Gdy logowania nie da się
 * obsłużyć, jesteś po prostu gościem; wytłumaczy to strona logowania.
 */
export const uzytkownik = cache(async () => {
  if (!logowanieDziala()) return null
  const supabase = await supabaseSerwer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})
