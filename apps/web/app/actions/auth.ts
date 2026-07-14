'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@isaacdex/db'
import { supabaseSerwer } from '@/lib/supabase/serwer'
import { zalozGracza } from '@/lib/konto'

/**
 * Logowanie i rejestracja (Supabase Auth, e-mail + hasło).
 *
 * Konto w Supabase to dopiero połowa — druga to gracz w naszej bazie (nick, kolor, pfp,
 * obserwacje). Zakładamy go przy pierwszym wejściu na konto, nie przy samej rejestracji:
 * jeśli Supabase wymaga potwierdzenia maila, konto istnieje, zanim ktokolwiek się zaloguje.
 */

export type StanAuth = { blad?: string; info?: string }

const MIN_HASLO = 8

/** Puste pola i za krótkie hasło wyłapujemy sami — komunikat Supabase byłby po angielsku. */
function sprawdz(email: string, haslo: string): string | null {
  if (!email.includes('@')) return 'To nie wygląda na adres e-mail.'
  if (haslo.length < MIN_HASLO) return `Hasło musi mieć co najmniej ${MIN_HASLO} znaków.`
  return null
}

export async function zarejestruj(_stan: StanAuth, dane: FormData): Promise<StanAuth> {
  const email = String(dane.get('email') ?? '').trim()
  const haslo = String(dane.get('haslo') ?? '')
  const nick = String(dane.get('nick') ?? '').trim()

  const blad = sprawdz(email, haslo)
  if (blad) return { blad }
  if (nick.length < 3) return { blad: 'Nick musi mieć co najmniej 3 znaki.' }

  // Nick jest widoczny w feedzie i czacie, więc musi być wolny — sprawdzamy PRZED założeniem
  // konta w Supabase, żeby nie zostawić konta bez gracza.
  if (await prisma.gracz.findUnique({ where: { nick } })) {
    return { blad: 'Ten nick jest już zajęty. Wybierz inny.' }
  }

  const supabase = await supabaseSerwer()
  const { data, error } = await supabase.auth.signUp({
    email,
    password: haslo,
    options: { data: { nick } }, // nick zapamiętany przy koncie — użyjemy go przy pierwszym logowaniu
  })

  if (error) return { blad: tlumaczBlad(error.message) }

  // Gdy potwierdzanie maila jest włączone, Supabase nie zwraca sesji — nie ma jeszcze kogo zalogować.
  if (!data.session) {
    return { info: 'Konto założone. Potwierdź adres e-mail, a potem zaloguj się.' }
  }

  await zalozGracza(data.user!.id, nick)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function zaloguj(_stan: StanAuth, dane: FormData): Promise<StanAuth> {
  const email = String(dane.get('email') ?? '').trim()
  const haslo = String(dane.get('haslo') ?? '')

  const blad = sprawdz(email, haslo)
  if (blad) return { blad }

  const supabase = await supabaseSerwer()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: haslo })
  if (error) return { blad: tlumaczBlad(error.message) }

  // Pierwsze logowanie po potwierdzeniu maila: konto jest, gracza jeszcze nie.
  const nick = (data.user.user_metadata?.nick as string | undefined) ?? email.split('@')[0]
  await zalozGracza(data.user.id, nick)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function wyloguj() {
  const supabase = await supabaseSerwer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

/** Supabase mówi po angielsku; użytkownik czyta po polsku. */
function tlumaczBlad(wiadomosc: string): string {
  const m = wiadomosc.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Zły e-mail albo hasło.'
  if (m.includes('email not confirmed')) return 'Najpierw potwierdź adres e-mail.'
  if (m.includes('already registered') || m.includes('already been registered')) {
    return 'Konto z tym e-mailem już istnieje. Zaloguj się.'
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Za dużo prób. Odczekaj chwilę.'
  }
  return wiadomosc
}
