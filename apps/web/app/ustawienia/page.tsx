import Link from 'next/link'
import FloorSwitcher from '@/components/FloorSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import CompanionPicker from '@/components/CompanionPicker'
import JezykPicker from '@/components/JezykPicker'
import UsunKonto from '@/components/UsunKonto'
import Sprite from '@/components/Sprite'
import { getProfilSetup } from '@/lib/queries'
import { czyZalogowany } from '@/lib/konto'
import { wyloguj } from '@/app/actions/auth'
import { tlumacz } from '@/lib/i18n/serwer'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return { title: tlumacz()('ustawienia.tytul') }
}

export default async function UstawieniaPage() {
  const [setup, zalogowany] = await Promise.all([getProfilSetup(), czyZalogowany()])
  const t = tlumacz()
  return (
    <section>
      <div className="note">
        <h2>
          <Sprite name="coin" size={22} /> {t('ustawienia.steamNaglowek')}
        </h2>
        <p className="muted small">{t('ustawienia.steamOpis')}</p>
        {zalogowany ? (
          <>
            <p className="small steam-line">
              {/* Bez surowego SteamID — nikomu nic nie mówi, a wygląda jak wyciek. */}
              <b>
                {setup.steamId ? t('ustawienia.steamPodpiete') : t('ustawienia.steamNiepodpiete')}
              </b>
              {setup.zsynchronizowano ? (
                <span className="steam-ok">{t('ustawienia.steamZsync')}</span>
              ) : (
                <span className="muted">{t('ustawienia.steamBrakSync')}</span>
              )}
            </p>
            <div className="settings-row">
              <Link className="btn sync-btn" href="/kolekcja">
                <Sprite name="book" size={20} /> {t('ustawienia.steamSynchronizuj')}
                <span className="sync-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="small steam-line muted">{t('ustawienia.steamTylkoZalogowany')}</p>
            <div className="settings-row">
              <Link className="btn sync-btn" href="/logowanie">
                <Sprite name="isaacHead" size={20} /> {t('ustawienia.steamZalogujBy')}
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
          <Sprite name="foundsoul" size={22} /> {t('ustawienia.companionNaglowek')}
        </h2>
        <p className="muted small">{t('ustawienia.companionOpis')}</p>
        <div className="settings-row">
          <CompanionPicker />
        </div>
      </div>

      {/* Język tuż pod Companionem, a nad wyglądem: to ustawienie zmienia CAŁĄ apkę, więc
          stoi wyżej niż skin kartek czy kursor, które zmieniają tylko to, jak wygląda. */}
      <div className="note">
        <h2>
          <Sprite name="book" size={22} /> {t('ustawienia.jezykNaglowek')}
        </h2>
        <p className="muted small">{t('ustawienia.jezykOpis')}</p>
        <div className="settings-row">
          <JezykPicker />
        </div>
      </div>

      <div className="note">
        <h2>
          <Sprite name="sun" size={22} /> {t('ustawienia.kartkiNaglowek')}
        </h2>
        <p
          className="muted small"
          // Opis ma pogrubione nazwy wariantów, a tłumaczenie trzyma je jako <b> w tekście —
          // inaczej trzeba by ciąć zdanie na trzy klucze i składać je w JSX, co w drugim
          // języku i tak rozjedzie się przy innym szyku.
          dangerouslySetInnerHTML={{ __html: t('ustawienia.kartkiOpis') }}
        />
        <div className="settings-row">
          <ThemeToggle />
        </div>
      </div>

      <div className="note">
        <h2>{t('ustawienia.kursorNaglowek')}</h2>
        <p className="muted small">
          {t('ustawienia.kursorOpis')} <Sprite name="fly" size={20} />
        </p>
        <div className="settings-row">
          <FloorSwitcher />
        </div>
      </div>

      {/* Konto na samym dole — wylogowanie, a pod nim (nieodwracalne) usunięcie konta. */}
      {zalogowany && (
        <div className="note">
          <h2>
            <Sprite name="isaacHead" size={22} /> {t('ustawienia.kontoNaglowek')}
          </h2>
          <p className="muted small">{t('ustawienia.kontoOpis')}</p>
          <div className="settings-row konto-akcje">
            <form action={wyloguj}>
              <button className="btn" type="submit">
                <Sprite name="superfan" size={18} /> {t('ustawienia.kontoWyloguj')}
              </button>
            </form>
            <UsunKonto />
          </div>
        </div>
      )}
    </section>
  )
}
