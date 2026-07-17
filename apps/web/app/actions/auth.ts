'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@isaacdex/db'
import { supabaseSerwer } from '@/lib/supabase/serwer'
import { konfiguracjaSupabase } from '@/lib/supabase/konfiguracja'
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
  | 'klucz'
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

/**
 * Czy w ogóle jest czym się logować. Sprawdza ADRES I KLUCZ (kiedyś tylko adres — przez co
 * urwany klucz przechodził dalej i wracał z Supabase jako bezimienne „Coś poszło nie tak").
 * Zwraca gotowy kod błędu albo null, gdy wszystko gra.
 */
function blednaKonfiguracja(): KodBledu | null {
  const stan = konfiguracjaSupabase()
  if (stan.ok) return null
  return stan.powod === 'klucz' ? 'klucz' : 'nieskonfigurowane'
}

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
  const zlaKonfiguracja = blednaKonfiguracja()
  if (zlaKonfiguracja) naLogowanie(zlaKonfiguracja, 'rejestracja')

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
  // Świeże konto ląduje na PULPICIE, nie w edytorze profilu: pierwsze, co ma zobaczyć,
  // to apka i lista „Pierwsze kroki" (która i tak prowadzi do edytora), a nie formularz
  // z pytaniem, kim jest. Parametr `?nowe=1` i tak nigdy nie był nigdzie obsługiwany.
  redirect('/')
}

/**
 * „Nie pamiętam hasła": Supabase wysyła link resetujący na maila. Nie zdradzamy, czy adres
 * istnieje (antyenumeracja) — zawsze odpowiadamy „sprawdź skrzynkę". Link prowadzi na
 * /logowanie/nowe-haslo, gdzie ustawia się nowe hasło.
 */
export async function zresetujHaslo(dane: FormData) {
  const zlaKonfiguracja = blednaKonfiguracja()
  if (zlaKonfiguracja) redirect(`/logowanie/reset?blad=${zlaKonfiguracja}`)
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
  const zlaKonfiguracja = blednaKonfiguracja()
  if (zlaKonfiguracja) naLogowanie(zlaKonfiguracja)

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
  if (blednaKonfiguracja()) return
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
  if (blednaKonfiguracja()) return
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
  // Klucz przeszedł nasze sprawdzenie, a Supabase i tak go odrzucił (np. klucz z innego
  // projektu albo unieważniony). To wina konfiguracji serwera, nie tego, kto się loguje.
  if (m.includes('invalid api key')) return 'klucz'
  if (m.includes('email not confirmed')) return 'niepotwierdzony'
  if (m.includes('already registered') || m.includes('already been registered')) return 'istnieje'
  if (m.includes('rate limit') || m.includes('over_email_send')) return 'limit-maili'
  return 'inny'
}
