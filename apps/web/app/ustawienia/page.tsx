import Link from 'next/link'
import FloorSwitcher from '@/components/FloorSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import CompanionPicker from '@/components/CompanionPicker'
import UsunKonto from '@/components/UsunKonto'
import Sprite from '@/components/Sprite'
import { getProfilSetup } from '@/lib/queries'
import { czyZalogowany } from '@/lib/konto'
import { wyloguj } from '@/app/actions/auth'

export const metadata = { title: 'Ustawienia — IsaacDex' }
export const dynamic = 'force-dynamic'

export default async function UstawieniaPage() {
  const [setup, zalogowany] = await Promise.all([getProfilSetup(), czyZalogowany()])
  return (
    <section>
      <div className="note">
        <h2>
          <Sprite name="coin" size={22} /> Konto Steam
        </h2>
        <p className="muted small">
          Achievementy i completion marks pobierane są z Twojego profilu Steam (TBOI, appid 250900).
        </p>
        {zalogowany ? (
          <>
            <p className="small steam-line">
              {/* Bez surowego SteamID — nikomu nic nie mówi, a wygląda jak wyciek. */}
              <b>{setup.steamId ? 'Konto podpięte' : 'Konto niepodpięte'}</b>
              {setup.zsynchronizowano ? (
                <span className="steam-ok"> · zsynchronizowano ✓</span>
              ) : (
                <span className="muted"> · brak synchronizacji</span>
              )}
            </p>
            <div className="settings-row">
              <Link className="btn sync-btn" href="/kolekcja">
                <Sprite name="book" size={20} /> Synchronizuj w Osiągnięciach
                <span className="sync-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="small steam-line muted">
              Konto Steam podłączysz dopiero po zalogowaniu — inaczej nie ma gdzie zapisać Twoich
              osiągnięć.
            </p>
            <div className="settings-row">
              <Link className="btn sync-btn" href="/logowanie">
                <Sprite name="isaacHead" size={20} /> Zaloguj się, aby podłączyć Steam
                <span className="sync-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </>
        )}
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

      {/* Konto na samym dole — wylogowanie, a pod nim (nieodwracalne) usunięcie konta. */}
      {zalogowany && (
        <div className="note">
          <h2>
            <Sprite name="isaacHead" size={22} /> Konto
          </h2>
          <p className="muted small">
            Wyloguj się na tym urządzeniu albo usuń konto na zawsze — razem z profilem, znajomymi i
            wpisami.
          </p>
          <div className="settings-row konto-akcje">
            <form action={wyloguj}>
              <button className="btn" type="submit">
                <Sprite name="superfan" size={18} /> Wyloguj się
              </button>
            </form>
            <UsunKonto />
          </div>
        </div>
      )}
    </section>
  )
}
