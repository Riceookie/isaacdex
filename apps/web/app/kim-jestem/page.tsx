import Link from 'next/link'
import Sprite from '@/components/Sprite'
import KimJestemForm from '@/components/KimJestemForm'
import { getProfilSetup } from '@/lib/queries'
import { mojGracz } from '@/lib/konto'

export const dynamic = 'force-dynamic'

/** Komunikat po powrocie ze Steama (?steam=…). Bez tego podpięcie kończyłoby się ciszą. */
const KOMUNIKAT: Record<string, { tekst: string; zle?: boolean }> = {
  ok: { tekst: 'Steam podłączony. Możesz zsynchronizować osiągnięcia.' },
  blad: { tekst: 'Steam nie potwierdził logowania. Spróbuj jeszcze raz.', zle: true },
  zajety: { tekst: 'To konto Steam jest już przypięte do innego konta w IsaacDex.', zle: true },
}

export default async function KimJestemPage({
  searchParams,
}: {
  searchParams: { steam?: string }
}) {
  const [dane, ja] = await Promise.all([getProfilSetup(), mojGracz()])
  const komunikat = searchParams.steam ? KOMUNIKAT[searchParams.steam] : undefined

  return (
    <section className="whoami-page">
      {komunikat && (
        <p className={'note steam-komunikat' + (komunikat.zle ? ' zle' : '')} role="status">
          <Sprite name={komunikat.zle ? 'skull' : 'heart'} size={16} /> {komunikat.tekst}
        </p>
      )}

      <div className="note steam-karta">
        <h2>
          <Sprite name="trophy" size={20} /> Konto Steam
        </h2>

        {!ja ? (
          <p className="muted small">
            <Link href="/logowanie">Zaloguj się</Link>, żeby podłączyć swojego Steama i widzieć
            własne osiągnięcia zamiast cudzych.
          </p>
        ) : dane.steamId ? (
          <p className="muted small">
            Podłączony: <b>{dane.steamId}</b>
            {dane.zsynchronizowano
              ? ' — osiągnięcia zsynchronizowane.'
              : ' — jeszcze bez synchronizacji.'}
          </p>
        ) : (
          <>
            <p className="muted small">
              Bez Steama IsaacDex nie zna Twoich osiągnięć ani completion marks — profil będzie
              pusty.
            </p>
            {/* Zwykły link, nie fetch: Steam musi zobaczyć użytkownika, a nie nasz serwer. */}
            <a className="btn" href="/api/steam/polacz">
              Podłącz Steam
            </a>
          </>
        )}
      </div>

      <div className="note whoami-card">
        <KimJestemForm {...dane} />
      </div>
    </section>
  )
}
