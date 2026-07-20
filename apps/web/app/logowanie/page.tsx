import { redirect } from 'next/navigation'
import LogowanieForm from '@/components/LogowanieForm'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'
import type { Klucz } from '@/lib/i18n/slownik'
import type { KodBledu } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  return { title: tlumacz()('konto.tytulStronyLogowanie') }
}

/**
 * Kody błędów z akcji na klucze słownika. KOD zostaje w adresie (?blad=nick-krotki) i jest
 * niezależny od języka — tłumaczy się dopiero zdanie, które serwer wstawia do formularza.
 * Serwer je renderuje, więc komunikaty przeżywają przeładowanie.
 */
const BLEDY: Record<KodBledu, Klucz> = {
  nieskonfigurowane: 'konto.bladNieskonfigurowane',
  klucz: 'konto.bladKlucz',
  email: 'konto.bladEmail',
  haslo: 'konto.bladHaslo',
  'nick-krotki': 'konto.bladNickKrotki',
  'nick-dlugi': 'konto.bladNickDlugi',
  'nick-zajety': 'konto.bladNickZajety',
  dane: 'konto.bladDane',
  niepotwierdzony: 'konto.bladNiepotwierdzony',
  istnieje: 'konto.bladIstnieje',
  'limit-maili': 'konto.bladLimitMaili',
  steam: 'konto.bladSteam',
  inny: 'konto.bladInny',
}

const INFO: Record<string, Klucz> = {
  potwierdz: 'konto.infoPotwierdz',
}

export default async function LogowaniePage({
  searchParams,
}: {
  searchParams: { tryb?: string; blad?: string; info?: string }
}) {
  // Zalogowanego nie ma po co pytać o hasło.
  if (await mojGracz()) redirect('/profil')

  const t = tlumacz()
  const kluczInfo = searchParams.info ? INFO[searchParams.info] : undefined

  return (
    <section className="log-strona">
      <div className="note log-karta">
        <LogowanieForm
          rejestracja={searchParams.tryb === 'rejestracja'}
          blad={
            searchParams.blad ? t(BLEDY[searchParams.blad as KodBledu] ?? BLEDY.inny) : undefined
          }
          info={kluczInfo ? t(kluczInfo) : undefined}
        />
      </div>
    </section>
  )
}
