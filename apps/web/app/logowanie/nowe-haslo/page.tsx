import Sprite from '@/components/Sprite'
import NoweHasloForm from '@/components/NoweHasloForm'
import { tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  return { title: tlumacz()('konto.tytulStronyNoweHaslo') }
}

/** Strona lądowania linku resetującego z maila — samo ustawienie hasła robi klient. */
export default function NoweHasloPage() {
  const t = tlumacz()
  return (
    <section className="log-strona">
      <div className="note log-karta">
        <div className="log-box">
          <header className="log-head">
            <Sprite name="momsContact" size={40} />
            <div>
              <h1>{t('konto.noweHaslo')}</h1>
              <p className="muted small">{t('konto.noweHasloPodtytul')}</p>
            </div>
          </header>
          <NoweHasloForm />
        </div>
      </div>
    </section>
  )
}
