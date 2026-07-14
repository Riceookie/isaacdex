import { redirect } from 'next/navigation'
import LogowanieForm from '@/components/LogowanieForm'
import { mojGracz } from '@/lib/konto'
import type { KodBledu } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Logowanie — IsaacDex' }

/** Kody błędów z akcji na zdania po polsku. Serwer je renderuje, więc przeżywają przeładowanie. */
const BLEDY: Record<KodBledu, string> = {
  nieskonfigurowane: 'Logowanie nie jest jeszcze skonfigurowane na tym serwerze.',
  email: 'To nie wygląda na adres e-mail.',
  haslo: 'Hasło musi mieć co najmniej 8 znaków.',
  'nick-krotki': 'Nick musi mieć co najmniej 3 znaki.',
  'nick-zajety': 'Ten nick jest już zajęty. Wybierz inny.',
  dane: 'Zły e-mail albo hasło.',
  niepotwierdzony: 'Najpierw potwierdź adres e-mail (link w wiadomości od Supabase).',
  istnieje: 'Konto z tym e-mailem już istnieje. Zaloguj się.',
  'limit-maili':
    'Supabase nie wysłał maila potwierdzającego — wyczerpany limit wysyłki. Wyłącz „Confirm email” w ustawieniach projektu albo poczekaj godzinę.',
  inny: 'Coś poszło nie tak. Spróbuj jeszcze raz.',
}

const INFO: Record<string, string> = {
  potwierdz: 'Konto założone. Potwierdź adres e-mail, a potem zaloguj się.',
}

export default async function LogowaniePage({
  searchParams,
}: {
  searchParams: { tryb?: string; blad?: string; info?: string }
}) {
  // Zalogowanego nie ma po co pytać o hasło.
  if (await mojGracz()) redirect('/profil')

  return (
    <section className="log-strona">
      <div className="note log-karta">
        <LogowanieForm
          rejestracja={searchParams.tryb === 'rejestracja'}
          blad={
            searchParams.blad ? (BLEDY[searchParams.blad as KodBledu] ?? BLEDY.inny) : undefined
          }
          info={searchParams.info ? INFO[searchParams.info] : undefined}
        />
      </div>
    </section>
  )
}
