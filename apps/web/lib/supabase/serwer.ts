import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Klient Supabase po stronie serwera (komponenty serwerowe, server actions, route handlery).
 * Sesja siedzi w ciasteczkach, więc czyta ją każdy render — nie trzeba jej przekazywać w propsach.
 *
 * Komponenty serwerowe nie mogą pisać ciasteczek; odświeżaniem sesji zajmuje się middleware,
 * dlatego zapis tutaj jest celowo połknięty (patrz middleware.ts).
 */
export async function supabaseSerwer() {
  const ciasteczka = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  )
}

/** Zalogowany użytkownik albo null. Jedyne źródło prawdy o tym, kim jesteś. */
export async function uzytkownik() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null // logowanie nieskonfigurowane
  const supabase = await supabaseSerwer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
