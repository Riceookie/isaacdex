import Sprite from '@/components/Sprite'
import NoweHasloForm from '@/components/NoweHasloForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Nowe hasło — IsaacDex' }

/** Strona lądowania linku resetującego z maila — samo ustawienie hasła robi klient. */
export default function NoweHasloPage() {
  return (
    <section className="log-strona">
      <div className="note log-karta">
        <div className="log-box">
          <header className="log-head">
            <Sprite name="momsContact" size={40} />
            <div>
              <h1>Nowe hasło</h1>
              <p className="muted small">Wpisz nowe hasło do swojej piwnicy.</p>
            </div>
          </header>
          <NoweHasloForm />
        </div>
      </div>
    </section>
  )
}
