import Link from 'next/link'
import { redirect } from 'next/navigation'
import Sprite from '@/components/Sprite'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'
import type { Klucz } from '@/lib/i18n/slownik'
import { zresetujHaslo } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  return { title: tlumacz()('konto.tytulStronyReset') }
}

const BLEDY: Record<string, Klucz> = {
  nieskonfigurowane: 'konto.bladNieskonfigurowane',
  klucz: 'konto.bladKluczReset',
  email: 'konto.bladEmail',
}
const INFO: Record<string, Klucz> = {
  wyslano: 'konto.infoWyslano',
}

export default async function ResetPage({
  searchParams,
}: {
  searchParams: { blad?: string; info?: string }
}) {
  if (await mojGracz()) redirect('/profil')
  const t = tlumacz()
  const kluczBledu = searchParams.blad ? BLEDY[searchParams.blad] : undefined
  const kluczInfo = searchParams.info ? INFO[searchParams.info] : undefined
  const blad = kluczBledu ? t(kluczBledu) : undefined
  const info = kluczInfo ? t(kluczInfo) : undefined

  return (
    <section className="log-strona">
      <div className="note log-karta">
        <div className="log-box">
          <header className="log-head">
            <Sprite name="momsEye" size={40} />
            <div>
              <h1>{t('konto.resetTytul')}</h1>
              <p className="muted small">{t('konto.resetPodtytul')}</p>
            </div>
          </header>

          <form className="log-form" action={zresetujHaslo}>
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

            <button className="btn full" type="submit">
              {t('konto.resetWyslij')}
            </button>
          </form>

          <p className="muted small log-stopka">
            <Link href="/logowanie">{t('konto.wrocDoLogowania')}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
