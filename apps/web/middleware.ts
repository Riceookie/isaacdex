import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Odświeża sesję Supabase przy każdym żądaniu i dokłada świeże ciasteczka do odpowiedzi.
 * Bez tego token wygasa w trakcie korzystania z apki i użytkownik „sam się wylogowuje”.
 *
 * Middleware NIE pilnuje dostępu do stron — apka ma być oglądalna bez konta (gość widzi
 * profil właściciela). O to, czego nie wolno gościom, dba warstwa zapisu (server actions).
 */
export async function middleware(request: NextRequest) {
  const odpowiedz = NextResponse.next({ request })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return odpowiedz // logowanie nieskonfigurowane

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (doUstawienia) => {
          doUstawienia.forEach(({ name, value, options }) =>
            odpowiedz.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  await supabase.auth.getUser()
  return odpowiedz
}

export const config = {
  // Pomijamy statyki i obrazki — sesji nie trzeba odświeżać przy każdym spricie.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|tboi|pfp|fonts|.*\\.(?:png|webp|jpg|svg)$).*)',
  ],
}
