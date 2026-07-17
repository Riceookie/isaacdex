'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import Sprite from '@/components/Sprite'
import PoleHasla from '@/components/PoleHasla'
import { zaloguj, zarejestruj } from '@/app/actions/auth'

/**
 * Logowanie i rejestracja w jednym — dwie zakładki zamiast dwóch stron, bo to ta sama
 * decyzja („wejdź do piwnicy"), tylko raz pierwszy, a raz kolejny.
 *
 * Zakładka siedzi w ADRESIE (?tryb=rejestracja), nie w stanie komponentu: po akcji Supabase
 * zapisuje ciasteczka, Next odświeża drzewo i komponent montuje się od nowa — stan zniknąłby
 * razem z komunikatem błędu, a użytkownik zobaczyłby pusty formularz bez wyjaśnienia.
 */

function Wyslij({ etykieta }: { etykieta: string }) {
  const { pending } = useFormStatus()
  return (
    <button className="btn full" type="submit" disabled={pending}>
      {pending ? 'Chwila…' : etykieta}
    </button>
  )
}

export default function LogowanieForm({
  rejestracja,
  blad,
  info,
}: {
  rejestracja: boolean
  blad?: string
  info?: string
}) {
  return (
    <div className="log-box">
      <header className="log-head">
        <Sprite name="isaacHead" size={40} />
        <div>
          <h1>{rejestracja ? 'Załóż konto' : 'Zaloguj się'}</h1>
          <p className="muted small">
            {rejestracja
              ? 'Konto daje Ci własny profil, znajomych i wpisy w feedzie.'
              : 'Wróć do swojej piwnicy.'}
          </p>
        </div>
      </header>

      <div className="log-taby">
        <Link className={'pill-tab' + (!rejestracja ? ' on' : '')} href="/logowanie">
          Logowanie
        </Link>
        <Link
          className={'pill-tab' + (rejestracja ? ' on' : '')}
          href="/logowanie?tryb=rejestracja"
        >
          Rejestracja
        </Link>
      </div>

      {/* Wejście przez Steam — jeden klik, bez maila i hasła. Zwykły link, bo Steam musi
          zobaczyć użytkownika (przekierowanie na OpenID), a nie nasz serwer. */}
      <a className="btn steam-btn" href="/api/steam/polacz">
        <Sprite name="deadgod" size={20} />
        {rejestracja ? 'Zarejestruj się przez Steam' : 'Zaloguj się przez Steam'}
      </a>
      <div className="log-albo">
        <span>albo {rejestracja ? 'e-mailem' : 'e-mailem i hasłem'}</span>
      </div>

      <form className="log-form" action={rejestracja ? zarejestruj : zaloguj}>
        {rejestracja && (
          <label className="log-pole">
            <span>Nick</span>
            <input
              className="input"
              name="nick"
              required
              minLength={3}
              maxLength={24}
              placeholder="Jak mają Cię widzieć w feedzie"
              autoComplete="username"
            />
          </label>
        )}

        <label className="log-pole">
          <span>E-mail</span>
          <input
            className="input"
            name="email"
            type="email"
            required
            placeholder="ty@example.com"
            autoComplete="email"
          />
        </label>

        <PoleHasla autoComplete={rejestracja ? 'new-password' : 'current-password'} />

        {!rejestracja && (
          <p className="log-zapomniane">
            <Link href="/logowanie/reset">Nie pamiętasz hasła?</Link>
          </p>
        )}

        {blad && (
          <p className="log-blad" role="alert">
            <Sprite name="skull" size={14} /> {blad}
          </p>
        )}
        {info && (
          <p className="log-info" role="status">
            <Sprite name="heart" size={14} /> {info}
          </p>
        )}

        <Wyslij etykieta={rejestracja ? 'Załóż konto' : 'Wejdź'} />
      </form>

      <p className="muted small log-stopka">
        Bez konta też możesz oglądać apkę — po prostu nie da się wtedy obserwować, lajkować ani
        pisać.
      </p>
    </div>
  )
}
