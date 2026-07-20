import { createBrowserClient } from '@supabase/ssr'
import { konfiguracjaSupabase } from '@/lib/supabase/konfiguracja'

/**
 * Klient Supabase w przeglądarce — czat na żywo, obecność, załączniki, zmiana hasła.
 *
 * Zwraca `null`, gdy konfiguracji nie ma albo jest widocznie zepsuta.
 *
 * Wcześniej leciało tu `process.env.NEXT_PUBLIC_…!` prosto do `createBrowserClient`, więc
 * przy braku zmiennych `@supabase/ssr` rzucał „Your project's URL and API key are required"
 * i wywracał cały widok czatu. Zdarzyło się to na podglądowym deployu na Vercelu: zmienne
 * `NEXT_PUBLIC_*` są WKLEJANE W BUNDLE PODCZAS BUILDU, więc ustawione tylko dla środowiska
 * produkcyjnego po prostu nie istnieją w buildzie z gałęzi.
 *
 * `konfiguracjaSupabase()` powstała dokładnie po to, żeby zepsuta konfiguracja mówiła, co
 * jest nie tak — a ten plik jako jedyny ją omijał. Teraz brak konfiguracji to zwykły stan
 * aplikacji („czat na żywo niedostępny"), a nie wyjątek z biblioteki.
 */
// Typ zwracany JEST WNIOSKOWANY, celowo. Adnotacja przez `ReturnType<typeof
// createBrowserClient>` gubi parametry generyczne klienta i wszystkie callbacki Realtime
// (`payload`, `status`, `sesja`) robią się `any` — kompilator przestaje ich pilnować.
export function supabasePrzegladarka() {
  const konf = konfiguracjaSupabase()
  if (!konf.ok) return null
  return createBrowserClient(konf.url, konf.klucz)
}
