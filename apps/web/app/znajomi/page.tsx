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
import { getFeed, getGracze, getLicznikiSpoleczne, type GraczKarta } from '@/lib/social'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Znajomi — IsaacDex' }

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
  // Gość nie ma sieci znajomych — cała zakładka to jedno zaproszenie do logowania.
  if (!(await czyZalogowany())) {
    return (
      <section className="znajomi">
        <header className="znajomi-naglowek">
          <h1>
            <Sprite name="friends" size={28} /> Znajomi
          </h1>
        </header>
        <div className="note gosc-panel">
          <ZalogujStan
            tekst={
              <>
                <b>Nawet Isaac zaczynał sam.</b> Załóż konto, żeby dodawać znajomych, obserwować
                graczy i podglądać w feedzie, kto właśnie oberwał traumą.
              </>
            }
            cta="Załóż konto"
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
          <Sprite name="friends" size={28} /> Znajomi
        </h1>
        <p className="muted small">
          Znajomy = obserwujecie się nawzajem. Sam nikt do piwnicy nie schodzi.
        </p>
      </header>

      <SzukajGraczy />

      <div className="znajomi-grid">
        {/* ── PANEL: Twoja sieć ── */}
        <div className="znajomi-panel">
          <div className="note">
            <div className="paper-head">
              <h2>Twoja sieć</h2>
            </div>
            <div className="soc-liczniki">
              <span>
                <b>{liczniki.znajomi}</b> znajomych
              </span>
              <span>
                <b>{liczniki.obserwuje}</b> obserwujesz
              </span>
              <span>
                <b>{liczniki.obserwujacych}</b> obserwujących
              </span>
              <span>
                <b>{liczniki.wpisy}</b> wpisów
              </span>
            </div>
          </div>

          {czekaja.length > 0 && (
            <div className="note note-cta">
              <div className="paper-head">
                <h3>
                  <Sprite name="heart" size={18} /> Czekają na odwzajemnienie ({czekaja.length})
                </h3>
              </div>
              <p className="muted small">Obserwują Cię. Jeden klik i robi się znajomość.</p>
              <ul className="soc-lista">
                {czekaja.map((g) => (
                  <WierszGracza key={g.id} g={g} />
                ))}
              </ul>
            </div>
          )}

          <Lista
            tytul="Znajomi"
            ikona="friends"
            gracze={znajomi}
            pusto={<PustyStan maly tekst={PUSTKA.brakZnajomych} />}
          />

          <Lista
            tytul="Obserwowani"
            ikona="stopwatch"
            gracze={obserwowani}
            podpis="Obserwujesz jednostronnie — jeszcze nie odwzajemnili."
            pusto={<p className="muted small">Nikogo nie obserwujesz jednostronnie. Czysto.</p>}
          />
        </div>

        {/* ── FEED: znajomi albo globalny ── */}
        <div className="znajomi-feed">
          <div className="feed-head">
            <h2>Aktywność</h2>
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
                    Zobacz feed globalny
                  </Link>
                ) : null
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
            <Sprite name="friendfinder" size={24} /> Odkryj graczy
          </h2>
          <span className="muted small">Ciekawe save file’y z całej piwnicy</span>
        </div>

        {doPoznania.length === 0 ? (
          <PustyStan
            maly
            tekst={
              <>
                <b>Znasz już wszystkich.</b> Piwnica nie ma więcej mieszkańców.
              </>
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
