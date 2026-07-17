'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@isaacdex/db'
import { supabaseSerwer } from '@/lib/supabase/serwer'
import { zalozGracza } from '@/lib/konto'

/**
 * Logowanie i rejestracja (Supabase Auth, e-mail + hasło).
 *
 * Wynik wraca w ADRESIE (?blad=… / ?info=…), a nie w stanie formularza — i to nie jest
 * kaprys. `supabase.auth` zapisuje ciasteczka sesji, więc po akcji Next odświeża drzewo
 * i komponent klienta montuje się od nowa; stan z useFormState wyparowywał razem z nim,
 * a użytkownik w odpowiedzi dostawał ciszę. Komunikat z adresu przeżywa przemontowanie
 * i działa nawet z wyłączonym JS.
 *
 * Konto w Supabase to dopiero połowa — druga to gracz w naszej bazie (nick, kolor, pfp,
 * obserwacje). Zakładamy go przy pierwszym wejściu na konto, nie przy samej rejestracji:
 * jeśli Supabase wymaga potwierdzenia maila, konto istnieje, zanim ktokolwiek się zaloguje.
 */

const MIN_HASLO = 8

/** Kody wracają w URL-u; na tekst zamienia je strona (patrz app/logowanie/page.tsx). */
export type KodBledu =
  | 'nieskonfigurowane'
  | 'email'
  | 'haslo'
  | 'nick-krotki'
  | 'nick-zajety'
  | 'dane'
  | 'niepotwierdzony'
  | 'istnieje'
  | 'limit-maili'
  | 'steam'
  | 'inny'

const brakKluczy = () => !process.env.NEXT_PUBLIC_SUPABASE_URL

// Deklaracja funkcji, nie strzałka: TypeScript zawęża typy po wywołaniu `never` tylko wtedy,
// gdy funkcja jest zadeklarowana — inaczej nie wie, że dalszy kod jest nieosiągalny.
function naLogowanie(kod: KodBledu, tryb?: 'rejestracja'): never {
  redirect(`/logowanie?blad=${kod}${tryb ? `&tryb=${tryb}` : ''}`)
}

/** Puste pola i za krótkie hasło wyłapujemy sami — komunikat Supabase byłby po angielsku. */
function walidacja(email: string, haslo: string): KodBledu | null {
  if (!email.includes('@')) return 'email'
  if (haslo.length < MIN_HASLO) return 'haslo'
  return null
}

export async function zarejestruj(dane: FormData) {
  if (brakKluczy()) naLogowanie('nieskonfigurowane', 'rejestracja')

  const email = String(dane.get('email') ?? '').trim()
  const haslo = String(dane.get('haslo') ?? '')
  const nick = String(dane.get('nick') ?? '').trim()

  const blad = walidacja(email, haslo)
  if (blad) naLogowanie(blad, 'rejestracja')
  if (nick.length < 3) naLogowanie('nick-krotki', 'rejestracja')

  // Nick jest widoczny w feedzie i czacie. Jeśli trzyma go REALNE konto (z logowaniem) — stop.
  // Ale „stare" konto bez logowania (userId == null: gracz-demo albo profil sprzed ery kont)
  // można PRZEJĄĆ — to jest właśnie „ustaw hasło do starego konta".
  const istniejacy = await prisma.gracz.findUnique({ where: { nick } })
  if (istniejacy?.userId) naLogowanie('nick-zajety', 'rejestracja')

  const supabase = await supabaseSerwer()
  const { data, error } = await supabase.auth.signUp({
    email,
    password: haslo,
    options: { data: { nick } }, // nick zapamiętany przy koncie — użyjemy go przy pierwszym logowaniu
  })

  if (error) naLogowanie(kodBledu(error.message), 'rejestracja')

  // Gdy potwierdzanie maila jest włączone, Supabase nie zwraca sesji — nie ma jeszcze kogo zalogować.
  if (!data.session) redirect('/logowanie?info=potwierdz')

  if (istniejacy) {
    // Legacy claim: przypnij świeże konto Supabase do istniejącego gracza — jego profil,
    // znajomi i wpisy zostają, dochodzi tylko logowanie (e-mail + hasło).
    await prisma.gracz.update({ where: { id: istniejacy.id }, data: { userId: data.user!.id } })
  } else {
    await zalozGracza(data.user!.id, nick)
  }
  revalidatePath('/', 'layout')
  redirect('/kim-jestem?nowe=1')
}

/**
 * „Nie pamiętam hasła": Supabase wysyła link resetujący na maila. Nie zdradzamy, czy adres
 * istnieje (antyenumeracja) — zawsze odpowiadamy „sprawdź skrzynkę". Link prowadzi na
 * /logowanie/nowe-haslo, gdzie ustawia się nowe hasło.
 */
export async function zresetujHaslo(dane: FormData) {
  if (brakKluczy()) redirect('/logowanie/reset?blad=nieskonfigurowane')
  const email = String(dane.get('email') ?? '').trim()
  if (!email.includes('@')) redirect('/logowanie/reset?blad=email')

  const supabase = await supabaseSerwer()
  const naglowki = await headers()
  const origin = naglowki.get('origin') || `https://${naglowki.get('host')}`
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/logowanie/nowe-haslo`,
  })
  redirect('/logowanie/reset?info=wyslano')
}

export async function zaloguj(dane: FormData) {
  if (brakKluczy()) naLogowanie('nieskonfigurowane')

  const email = String(dane.get('email') ?? '').trim()
  const haslo = String(dane.get('haslo') ?? '')

  const blad = walidacja(email, haslo)
  if (blad) naLogowanie(blad)

  const supabase = await supabaseSerwer()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: haslo })
  if (error || !data.user) naLogowanie(error ? kodBledu(error.message) : 'inny')

  // Pierwsze logowanie po potwierdzeniu maila: konto jest, gracza jeszcze nie.
  const nick = (data.user.user_metadata?.nick as string | undefined) ?? email.split('@')[0]
  await zalozGracza(data.user.id, nick)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function wyloguj() {
  if (brakKluczy()) return
  const supabase = await supabaseSerwer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * Usunięcie konta: kasujemy gracza (kaskada zabiera obserwacje, wpisy i lajki) i wylogowujemy.
 * Profil Steam (osiągnięcia) zostaje odpięty w bazie, ale nie ginie — gdyby ktoś wrócił przez
 * Steam, OpenID znów przypnie go właścicielowi. Rekordu auth.users nie kasujemy (wymaga
 * service_role); na poziomie apki konto znika, a wylogowanie kończy sesję.
 */
export async function usunKonto() {
  const supabase = await supabaseSerwer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await prisma.gracz.deleteMany({ where: { userId: user.id } })
  }
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

/** Supabase mówi po angielsku i zbyt ogólnie; my mówimy po polsku i konkretnie. */
function kodBledu(wiadomosc: string): KodBledu {
  const m = wiadomosc.toLowerCase()
  if (m.includes('invalid login credentials')) return 'dane'
  if (m.includes('email not confirmed')) return 'niepotwierdzony'
  if (m.includes('already registered') || m.includes('already been registered')) return 'istnieje'
  if (m.includes('rate limit') || m.includes('over_email_send')) return 'limit-maili'
  return 'inny'
}
