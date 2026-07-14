import { createBrowserClient } from '@supabase/ssr'

/** Klient Supabase w przeglądarce — do wylogowania i (wkrótce) czatu na żywo. */
export const supabasePrzegladarka = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
