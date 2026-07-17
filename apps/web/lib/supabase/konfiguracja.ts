/**
 * Jedno miejsce, które odpowiada na pytanie „czy da się teraz logować i czym".
 *
 * Powstało po awarii, w której na produkcji klucz anon miał URWANY JEDEN ZNAK (wklejony
 * ręcznie do panelu hostingu). Klucz wyglądał poprawnie — trzy segmenty, właściwy początek
 * i koniec — więc apka podawała go dalej, a Supabase odpowiadał „Invalid API key" na KAŻDE
 * logowanie i rejestrację. Użytkownik widział tylko „Coś poszło nie tak", bo zepsuta
 * konfiguracja jest nie do odróżnienia od zwykłego błędu, jeśli nikt jej nie sprawdza.
 *
 * Dlatego klucz jest tu oglądany, zanim pojedzie do Supabase.
 */

export type StanKonfiguracji =
  { ok: true; url: string; klucz: string } | { ok: false; powod: 'brak' | 'klucz' }

/**
 * Czy klucz jest widocznie uszkodzony.
 *
 * Oceniamy TYLKO klucze w formacie JWT (`eyJ…`), bo tylko o nich wiemy, jak mają wyglądać.
 * Nowe klucze Supabase (`sb_publishable_…`) nie są JWT — przepuszczamy je bez oceny, żeby
 * ten strażnik nigdy nie zablokował logowania, którego nie rozumie.
 *
 * `atob`, nie `Buffer`: to samo sprawdzenie działa w middleware (Edge), gdzie Buffera nie ma.
 */
function kluczJestZepsuty(klucz: string): boolean {
  if (!klucz.startsWith('eyJ')) return false

  const czesci = klucz.split('.')
  if (czesci.length !== 3) return true

  try {
    const b64 = czesci[1].replace(/-/g, '+').replace(/_/g, '/')
    const dane = JSON.parse(atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '=')))
    // Każdy klucz Supabase niesie rolę (anon / service_role). Brak roli = to nie jest ten klucz.
    return typeof dane?.role !== 'string'
  } catch {
    // Payload się nie rozkodował — dokładnie ten objaw miał urwany klucz z produkcji.
    return true
  }
}

/** Adres i klucz do Supabase albo powód, dla którego logowanie jest teraz niemożliwe. */
export function konfiguracjaSupabase(): StanKonfiguracji {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const klucz = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !klucz) return { ok: false, powod: 'brak' }
  if (kluczJestZepsuty(klucz)) return { ok: false, powod: 'klucz' }

  return { ok: true, url, klucz }
}

/** Skrót dla miejsc, które tylko sprawdzają, czy w ogóle jest o czym mówić. */
export const logowanieDziala = () => konfiguracjaSupabase().ok
