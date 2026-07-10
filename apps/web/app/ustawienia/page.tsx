import Link from 'next/link'
import FloorSwitcher from '@/components/FloorSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import CompanionPicker from '@/components/CompanionPicker'
import Sprite from '@/components/Sprite'
import { getProfilSetup } from '@/lib/queries'

export const metadata = { title: 'Ustawienia — IsaacDex' }
export const dynamic = 'force-dynamic'

export default async function UstawieniaPage() {
  const setup = await getProfilSetup()
  return (
    <section>
      <div className="note">
        <h2>
          <Sprite name="coin" size={22} /> Konto Steam
        </h2>
        <p className="muted small">
          Achievementy i completion marks pobierane są z Twojego profilu Steam (TBOI, appid 250900).
        </p>
        <p className="small steam-line">
          Steam ID: <b>{setup.steamId || '— nie ustawiono —'}</b>
          {setup.zsynchronizowano ? (
            <span className="steam-ok"> · zsynchronizowano ✓</span>
          ) : (
            <span className="muted"> · brak synchronizacji</span>
          )}
        </p>
        <div className="settings-row">
          <Link className="btn sync-btn" href="/kolekcja">
            <Sprite name="book" size={20} /> Synchronizuj w Kolekcji
            <span className="sync-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="note">
        <h2>
          <Sprite name="foundsoul" size={22} /> Companion
        </h2>
        <p className="muted small">
          Twój towarzysz-familiar siedzi w rogu, wita Cię po nicku i prowadzi do Doradcy. Wybierz,
          kto ma Ci towarzyszyć:
        </p>
        <div className="settings-row">
          <CompanionPicker />
        </div>
      </div>

      <div className="note">
        <h2>
          <Sprite name="sun" size={22} /> Kartki
        </h2>
        <p className="muted small">
          Wygląd paneli: <b>Normalne</b> to jasny pergamin, <b>Tainted</b> to ciemniejsze kartki jak
          u splugawionych postaci. Wybór zapisuje się w przeglądarce.
        </p>
        <div className="settings-row">
          <ThemeToggle />
        </div>
      </div>

      <div className="note">
        <h2>Kursor</h2>
        <p className="muted small">
          Kursor-mucha <Sprite name="fly" size={20} /> zamiast strzałki (domyślnie wyłączony).
        </p>
        <div className="settings-row">
          <FloorSwitcher />
        </div>
      </div>
    </section>
  )
}
