'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Sprite from '@/components/Sprite'
import { zaloguj, zarejestruj, type StanAuth } from '@/app/actions/auth'

/**
 * Logowanie i rejestracja w jednym — dwie zakładki zamiast dwóch stron, bo to ta sama
 * decyzja („wejdź do piwnicy"), tylko raz pierwszy, a raz kolejny.
 *
 * Stan (błąd / komunikat) wraca z server action, więc walidacja hasła i zajętego nicku
 * dzieje się na serwerze — przeglądarka nie jest tu źródłem prawdy.
 */

const PUSTY: StanAuth = {}

function Wyslij({ etykieta }: { etykieta: string }) {
  const { pending } = useFormStatus()
  return (
    <button className="btn full" type="submit" disabled={pending}>
      {pending ? 'Chwila…' : etykieta}
    </button>
  )
}

export default function LogowanieForm() {
  const [tryb, setTryb] = useState<'logowanie' | 'rejestracja'>('logowanie')

  const [stanLog, akcjaLog] = useFormState(zaloguj, PUSTY)
  const [stanRej, akcjaRej] = useFormState(zarejestruj, PUSTY)

  const rejestracja = tryb === 'rejestracja'
  const stan = rejestracja ? stanRej : stanLog

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
        <button
          className={'pill-tab' + (!rejestracja ? ' on' : '')}
          onClick={() => setTryb('logowanie')}
          type="button"
        >
          Logowanie
        </button>
        <button
          className={'pill-tab' + (rejestracja ? ' on' : '')}
          onClick={() => setTryb('rejestracja')}
          type="button"
        >
          Rejestracja
        </button>
      </div>

      {/* Dwa osobne formularze (a nie jeden z przełącznikiem), żeby każdy miał własny stan błędu. */}
      <form className="log-form" action={rejestracja ? akcjaRej : akcjaLog} key={tryb}>
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

        <label className="log-pole">
          <span>Hasło</span>
          <input
            className="input"
            name="haslo"
            type="password"
            required
            minLength={8}
            placeholder="Co najmniej 8 znaków"
            autoComplete={rejestracja ? 'new-password' : 'current-password'}
          />
        </label>

        {stan.blad && (
          <p className="log-blad" role="alert">
            <Sprite name="skull" size={14} /> {stan.blad}
          </p>
        )}
        {stan.info && (
          <p className="log-info" role="status">
            <Sprite name="heart" size={14} /> {stan.info}
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
