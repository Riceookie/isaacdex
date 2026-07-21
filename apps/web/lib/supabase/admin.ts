import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { konfiguracjaSupabase } from '@/lib/supabase/konfiguracja'
import { supabaseSerwer } from '@/lib/supabase/serwer'

/**
 * Klient z kluczem SERVICE_ROLE — pełne uprawnienia, obchodzi RLS i potwierdzanie maila.
 *
 * Żyje WYŁĄCZNIE po stronie serwera (Node), nigdy pod NEXT_PUBLIC_: to klucz-wytrych do całego
 * projektu, więc nie może trafić do bundla przeglądarki ani do Edge. Zwraca null, gdy klucza
 * brak — wtedy operacja administracyjna po prostu się nie uda, zamiast wywracać apkę.
 *
 * `persistSession`/`autoRefreshToken` wyłączone: ten klient jest jednorazowy w request handlerze,
 * nie utrzymuje sesji — od trzymania sesji użytkownika jest klient z ciasteczek (supabaseSerwer).
 */
export function supabaseAdmin(): SupabaseClient | null {
  const stan = konfiguracjaSupabase()
  const klucz = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!stan.ok || !klucz) return null

  return createClient(stan.url, klucz, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Zaloguj przeglądarkę NA ISTNIEJĄCE konto Supabase, mając tylko jego `userId` — i dowód, że
 * należy się temu, kto właśnie tu przyszedł (u nas: SteamID potwierdzone przez OpenID).
 *
 * Hasła konta nie znamy (może to być konto e-mail/hasło z podpiętym Steamem), więc idziemy
 * dookoła, kanałem administracyjnym:
 *   1) admin czyta e-mail konta i generuje jednorazowy magic-link — `generateLink` NIE wysyła
 *      maila, tylko zwraca token (`hashed_token`), więc nikogo nie zasypujemy pocztą,
 *   2) zwykły klient z ciasteczek „konsumuje" ten token (`verifyOtp`) i zapisuje sesję —
 *      dokładnie tak, jakby użytkownik kliknął magic-link w skrzynce.
 *
 * Zwraca false, gdy się nie da (brak service_role, konto bez maila, token nie przeszedł);
 * wołający zamienia to na „nie udało się zalogować przez Steam".
 */
export async function zalogujNaKonto(userId: string): Promise<boolean> {
  const admin = supabaseAdmin()
  if (!admin) return false

  const { data: konto, error: bladKonta } = await admin.auth.admin.getUserById(userId)
  const email = konto?.user?.email
  if (bladKonta || !email) return false

  const { data: link, error: bladLinku } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })
  const tokenHash = link?.properties?.hashed_token
  if (bladLinku || !tokenHash) return false

  const supabase = await supabaseSerwer()
  const { error } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash: tokenHash })
  return !error
}
