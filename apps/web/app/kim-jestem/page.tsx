import Link from 'next/link'
import Sprite from '@/components/Sprite'
import KimJestemForm from '@/components/KimJestemForm'
import ZalogujStan from '@/components/ZalogujStan'
import { getProfilSetup } from '@/lib/queries'
import { mojGracz } from '@/lib/konto'
import { tlumacz } from '@/lib/i18n/serwer'
import type { Klucz } from '@/lib/i18n/slownik'

export const dynamic = 'force-dynamic'

/** Komunikat po powrocie ze Steama (?steam=…). Bez tego podpięcie kończyłoby się ciszą. */
const KOMUNIKAT: Record<string, { klucz: Klucz; zle?: boolean }> = {
  ok: { klucz: 'konto.steamOk' },
  blad: { klucz: 'konto.steamNiepotwierdzony', zle: true },
  zajety: { klucz: 'konto.steamZajety', zle: true },
}

export default async function KimJestemPage({
  searchParams,
}: {
  searchParams: { steam?: string }
}) {
  const [dane, ja] = await Promise.all([getProfilSetup(), mojGracz()])
  const t = tlumacz()
  const komunikat = searchParams.steam ? KOMUNIKAT[searchParams.steam] : undefined

  return (
    <section className="whoami-page">
      {komunikat && (
        <p className={'note steam-komunikat' + (komunikat.zle ? ' zle' : '')} role="status">
          <Sprite name={komunikat.zle ? 'skull' : 'heart'} size={16} /> {t(komunikat.klucz)}
        </p>
      )}

      <div className="note steam-karta">
        <h2>
          <Sprite name="trophy" size={20} /> {t('konto.kontoSteam')}
        </h2>

        {!ja ? (
          <p className="muted small">
            <Link href="/logowanie">{t('wspolne.zaloguj')}</Link>
            {t('konto.steamGoscPo')}
          </p>
        ) : dane.steamId ? (
          <p className="muted small">
            {/* Bez surowego SteamID — liczy się „czy podpięte", nie sam numer. */}
            <b>{t('konto.steamPodlaczony')}</b>
            {t(
              dane.zsynchronizowano
                ? 'konto.steamZsynchronizowane'
                : 'konto.steamBezSynchronizacji',
            )}
          </p>
        ) : (
          <>
            <p className="muted small">{t('konto.steamBezSteama')}</p>
            {/* Zwykły link, nie fetch: Steam musi zobaczyć użytkownika, a nie nasz serwer. */}
            <a className="btn" href="/api/steam/polacz">
              {t('konto.podlaczSteam')}
            </a>
          </>
        )}
      </div>

      <div className="note whoami-card">
        {ja ? (
          <KimJestemForm {...dane} />
        ) : (
          <ZalogujStan
            tekst={
              <>
                <b>{t('konto.goscPustaKartaMocne')}</b>
                {t('konto.goscPustaKartaReszta')}
              </>
            }
            cta={t('konto.zalozKonto')}
          />
        )}
      </div>
    </section>
  )
}
