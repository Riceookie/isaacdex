import Link from 'next/link'
import Sprite from '@/components/Sprite'
import FeedCard from '@/components/FeedCard'
import FeedZakres from '@/components/FeedZakres'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'
import SzukajGraczy from '@/components/SzukajGraczy'
import { KartaGracza, WierszGracza } from '@/components/KartaGracza'
import { czyZalogowany } from '@/lib/konto'
import { PUSTKA } from '@/lib/klimat'
import { tlumacz } from '@/lib/i18n/serwer'
import { getFeed, getGracze, getLicznikiSpoleczne, type GraczKarta } from '@/lib/social'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return { title: tlumacz()('spolecznosc.tytulStrony') }
}

/**
 * Znajomi: szukajka graczy, Twoja sieć i dwa osobne feedy (znajomi / globalny).
 *
 * Znajomy = obserwacja w obie strony. Dlatego lista rozpada się na trzy kubełki:
 * znajomi, obserwowani (czekają na odwzajemnienie) i ci, którzy obserwują Ciebie
 * (jeden klik od znajomości). Wszystko trwałe — leży w bazie, nie w stanie komponentu.
 */
export default async function ZnajomiPage({
  searchParams,
}: {
  searchParams?: Promise<{ feed?: string }>
}) {
  const t = tlumacz()

  // Gość nie ma sieci znajomych — cała zakładka to jedno zaproszenie do logowania.
  if (!(await czyZalogowany())) {
    return (
      <section className="znajomi">
        <header className="znajomi-naglowek">
          <h1>
            <Sprite name="friends" size={28} /> {t('spolecznosc.znajomi')}
          </h1>
        </header>
        <div className="note gosc-panel">
          <ZalogujStan
            // Zdania z pogrubieniem i linkami idą jako HTML — szyk zdania różni się
            // między językami, więc sklejanka z kilku kluczy by się rozjechała.
            tekst={<span dangerouslySetInnerHTML={{ __html: t('spolecznosc.goscTekst') }} />}
            cta={t('spolecznosc.zalozKonto')}
            poza={<span dangerouslySetInnerHTML={{ __html: t('spolecznosc.goscPoza') }} />}
          />
        </div>
      </section>
    )
  }

  // Domyślnie feed znajomych — to strona „moich ludzi", nie tablica całego świata.
  const zakres = (await searchParams)?.feed === 'global' ? 'global' : 'znajomi'
  const [gracze, feed, liczniki] = await Promise.all([
    getGracze(),
    getFeed(zakres),
    getLicznikiSpoleczne(),
  ])

  const znajomi = gracze.filter((g) => g.znajomy)
  const obserwowani = gracze.filter((g) => g.obserwowany && !g.znajomy)
  const czekaja = gracze.filter((g) => g.obserwujeMnie && !g.obserwowany)
  const doPoznania = gracze.filter((g) => !g.ja && !g.obserwowany && !g.obserwujeMnie)

  return (
    <section className="znajomi">
      <header className="znajomi-naglowek">
        <h1>
          <Sprite name="friends" size={28} /> {t('spolecznosc.znajomi')}
        </h1>
        <p className="muted small">{t('spolecznosc.podtytul')}</p>
      </header>

      <SzukajGraczy />

      <div className="znajomi-grid">
        {/* ── PANEL: Twoja sieć ── */}
        <div className="znajomi-panel">
          <div className="note">
            <div className="paper-head">
              <h2>{t('spolecznosc.twojaSiec')}</h2>
            </div>
            <div className="soc-liczniki">
              <span>
                <b>{liczniki.znajomi}</b>{' '}
                {t('spolecznosc.licznikZnajomi', { liczba: liczniki.znajomi })}
              </span>
              <span>
                <b>{liczniki.obserwuje}</b> {t('spolecznosc.licznikObserwujesz')}
              </span>
              <span>
                <b>{liczniki.obserwujacych}</b>{' '}
                {t('spolecznosc.licznikObserwujacych', { liczba: liczniki.obserwujacych })}
              </span>
              <span>
                <b>{liczniki.wpisy}</b> {t('spolecznosc.licznikWpisy', { liczba: liczniki.wpisy })}
              </span>
            </div>
          </div>

          {czekaja.length > 0 && (
            <div className="note note-cta">
              <div className="paper-head">
                <h3>
                  <Sprite name="heart" size={18} /> {t('spolecznosc.czekajaNaglowek')} (
                  {czekaja.length})
                </h3>
              </div>
              <p className="muted small">{t('spolecznosc.czekajaOpis')}</p>
              <ul className="soc-lista">
                {czekaja.map((g) => (
                  <WierszGracza key={g.id} g={g} />
                ))}
              </ul>
            </div>
          )}

          <Lista
            tytul={t('spolecznosc.znajomi')}
            ikona="friends"
            gracze={znajomi}
            pusto={<PustyStan maly tekst={PUSTKA.brakZnajomychLista} />}
          />

          <Lista
            tytul={t('spolecznosc.listaObserwowani')}
            ikona="stopwatch"
            gracze={obserwowani}
            podpis={t('spolecznosc.obserwowaniPodpis')}
            pusto={<p className="muted small">{t('spolecznosc.obserwowaniPusto')}</p>}
          />
        </div>

        {/* ── FEED: znajomi albo globalny ── */}
        <div className="znajomi-feed">
          <div className="feed-head">
            <h2>{t('spolecznosc.aktywnosc')}</h2>
            <FeedZakres zakres={zakres} bazowa="/znajomi" domyslny="znajomi" />
          </div>

          {feed.length === 0 ? (
            <PustyStan
              tekst={
                zakres === 'znajomi' && znajomi.length === 0
                  ? PUSTKA.brakZnajomych
                  : PUSTKA.brakAktywnosci
              }
              akcja={
                zakres === 'znajomi' ? (
                  <Link className="btn" href="/znajomi?feed=global">
                    {t('spolecznosc.feedGlobalny')}
                  </Link>
                ) : (
                  /* Feed globalny pusty = nikt (łącznie z Tobą) nic nie zsynchronizował.
                     Jedyne sensowne wyjście prowadzi do Twojego Steama. */
                  <Link className="btn" href="/kolekcja">
                    {t('spolecznosc.synchronizujSteam')}
                  </Link>
                )
              }
            />
          ) : (
            <div className="feed">
              {feed.map((w) => (
                <FeedCard key={w.id} w={w} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ODKRYJ GRACZY ── */}
      <div className="odkryj">
        <div className="feed-head">
          <h2>
            <Sprite name="friendfinder" size={24} /> {t('spolecznosc.odkryjGraczy')}
          </h2>
          <span className="muted small">{t('spolecznosc.odkryjPodpis')}</span>
        </div>

        {doPoznania.length === 0 ? (
          /* Dwa różne „pusto": albo naprawdę nie ma innych graczy (świeża apka), albo
             znasz już wszystkich. Jedno zdanie na oba brzmiało absurdalnie przy jednym
             mieszkańcu piwnicy. */
          <PustyStan
            maly
            tekst={
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    gracze.filter((g) => !g.ja).length === 0
                      ? t('spolecznosc.pierwszyTekst')
                      : t('spolecznosc.znaszWszystkich'),
                }}
              />
            }
            poza={
              gracze.filter((g) => !g.ja).length === 0 ? (
                <span dangerouslySetInnerHTML={{ __html: t('spolecznosc.pierwszyPoza') }} />
              ) : null
            }
          />
        ) : (
          <div className="gracze-siatka">
            {doPoznania.map((g) => (
              <KartaGracza key={g.id} g={g} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/** Sekcja listy graczy w panelu bocznym — z licznikiem i własnym pustym stanem. */
function Lista({
  tytul,
  ikona,
  gracze,
  podpis,
  pusto,
}: {
  tytul: string
  ikona: 'friends' | 'stopwatch'
  gracze: GraczKarta[]
  podpis?: string
  pusto: React.ReactNode
}) {
  return (
    <div className="note">
      <div className="paper-head">
        <h3>
          <Sprite name={ikona} size={18} /> {tytul} ({gracze.length})
        </h3>
      </div>
      {podpis && gracze.length > 0 && <p className="muted small">{podpis}</p>}
      {gracze.length === 0 ? (
        pusto
      ) : (
        <ul className="soc-lista">
          {gracze.map((g) => (
            <WierszGracza key={g.id} g={g} />
          ))}
        </ul>
      )}
    </div>
  )
}
