'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import Sprite from '@/components/Sprite'
import PoleHasla from '@/components/PoleHasla'
import { useT } from '@/components/JezykProvider'
import { zaloguj, zarejestruj } from '@/app/actions/auth'
import { NICK_MAX, NICK_MIN } from '@/lib/nick'

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
  const t = useT()
  return (
    <button className="btn full" type="submit" disabled={pending}>
      {pending ? t('konto.chwila') : etykieta}
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
  const t = useT()
  return (
    <div className="log-box">
      <header className="log-head">
        <Sprite name="isaacHead" size={40} />
        <div>
          <h1>{t(rejestracja ? 'konto.zalozKonto' : 'wspolne.zaloguj')}</h1>
          <p className="muted small">
            {t(rejestracja ? 'konto.podtytulRejestracja' : 'konto.podtytulLogowanie')}
          </p>
        </div>
      </header>

      <div className="log-taby">
        <Link className={'pill-tab' + (!rejestracja ? ' on' : '')} href="/logowanie">
          {t('konto.tabLogowanie')}
        </Link>
        <Link
          className={'pill-tab' + (rejestracja ? ' on' : '')}
          href="/logowanie?tryb=rejestracja"
        >
          {t('konto.tabRejestracja')}
        </Link>
      </div>

      {/* Wejście przez Steam — jeden klik, bez maila i hasła. Zwykły link, bo Steam musi
          zobaczyć użytkownika (przekierowanie na OpenID), a nie nasz serwer. */}
      <a className="btn steam-btn" href="/api/steam/polacz">
        <Sprite name="deadgod" size={20} />
        {t(rejestracja ? 'konto.steamRejestracja' : 'konto.steamLogowanie')}
      </a>
      <div className="log-albo">
        <span>{t(rejestracja ? 'konto.alboEmailem' : 'konto.alboEmailemHaslem')}</span>
      </div>

      <form className="log-form" action={rejestracja ? zarejestruj : zaloguj}>
        {rejestracja && (
          <label className="log-pole">
            <span>{t('konto.poleNick')}</span>
            <input
              className="input"
              name="nick"
              required
              minLength={NICK_MIN}
              maxLength={NICK_MAX}
              placeholder={t('konto.nickPlaceholder')}
              autoComplete="username"
            />
          </label>
        )}

        <label className="log-pole">
          <span>{t('konto.poleEmail')}</span>
          <input
            className="input"
            name="email"
            type="email"
            required
            placeholder={t('konto.emailPlaceholder')}
            autoComplete="email"
          />
        </label>

        <PoleHasla autoComplete={rejestracja ? 'new-password' : 'current-password'} />

        {!rejestracja && (
          <p className="log-zapomniane">
            <Link href="/logowanie/reset">{t('konto.niePamietaszHasla')}</Link>
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

        <Wyslij etykieta={t(rejestracja ? 'konto.zalozKonto' : 'konto.wejdz')} />
      </form>

      <p className="muted small log-stopka">{t('konto.stopkaBezKonta')}</p>
    </div>
  )
}
