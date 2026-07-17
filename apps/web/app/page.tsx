import Link from 'next/link'
import { getProfil } from '@/lib/queries'
import { getFeed, getLicznikiSpoleczne } from '@/lib/social'
import { czyZalogowany, mojGracz } from '@/lib/konto'
import { getOnboarding } from '@/lib/onboarding'
import { ikonaPostaci } from '@/lib/chars'
import type { DecorId } from '@/lib/pfpDecor'
import { PUSTKA } from '@/lib/klimat'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import PierwszeKroki from '@/components/PierwszeKroki'
import FeedCard from '@/components/FeedCard'
import FeedMore from '@/components/FeedMore'
import BasementRadio from '@/components/BasementRadio'
import FeedZakres from '@/components/FeedZakres'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ feed?: string }>
}) {
  const zakres = (await searchParams)?.feed === 'znajomi' ? 'znajomi' : 'global'
  const [zalogowany, p, feed, liczniki, ja, onboarding] = await Promise.all([
    czyZalogowany(),
    getProfil(),
    getFeed(zakres),
    getLicznikiSpoleczne(),
    mojGracz(),
    getOnboarding(),
  ])
  const gosc = !zalogowany

  // Feed globalny jest wspólny — pokazujemy go i gościowi. Personalna prawa szyna (profil,
  // postęp, najrzadsze) zależy od `p`: gość dostaje zamiast niej zaproszenie do logowania.

  // Feed jest teraz PRAWDZIWY: wpisy leżą w bazie (Twoje = z odblokowań Steam).
  const feedNodes = feed.slice(0, 6).map((w) => <FeedCard key={w.id} w={w} />)

  // Pusty feed znajomych zwykle znaczy „nie masz jeszcze znajomych", a nie „cisza w piwnicy" —
  // i wtedy jedyne sensowne wyjście prowadzi na Znajomych, nie do odświeżania Pulpitu.
  const brakZnajomych = zakres === 'znajomi' && liczniki.znajomi === 0

  return (
    <section className="home-grid">
      {/* ── GŁÓWNA KOLUMNA ── */}
      <div className="home-feed">
        <div className="feed-head">
          <h2>
            <Sprite name="friendfinder" size={26} /> Co słychać?
          </h2>
          <Link className="small" href="/znajomi">
            → Wszyscy znajomi
          </Link>
        </div>

        <FeedZakres zakres={zakres} />

        {feed.length === 0 ? (
          /* Pusty feed ma trzy różne przyczyny i każda ma inne wyjście. Kiedyś wszystkie
             prowadziły na „Zobacz feed globalny" — czyli tam, gdzie już jesteś. */
          <PustyStan
            tekst={
              brakZnajomych
                ? PUSTKA.brakZnajomych
                : gosc
                  ? PUSTKA.brakAktywnosciGosc
                  : PUSTKA.brakAktywnosci
            }
            akcja={
              brakZnajomych ? (
                <Link className="btn" href="/znajomi">
                  Znajdź graczy
                </Link>
              ) : gosc ? (
                <Link className="btn" href="/logowanie">
                  Załóż konto
                </Link>
              ) : (
                <Link className="btn" href="/kolekcja">
                  Synchronizuj ze Steam
                </Link>
              )
            }
            poza={
              gosc ? (
                <>
                  A bez konta i tak możesz zwiedzić <Link href="/encyklopedia">Encyklopedię</Link>{' '}
                  albo policzyć build w <Link href="/kalkulator">Kalkulatorze</Link>.
                </>
              ) : (
                <>
                  W międzyczasie: <Link href="/encyklopedia">Encyklopedia</Link> (717 itemów, 103
                  bossów) i <Link href="/kalkulator">Kalkulator</Link> statystyk.
                </>
              )
            }
          />
        ) : (
          <div className="feed">
            {feedNodes.slice(0, 3)}
            <FeedMore count={feedNodes.length - 3}>{feedNodes.slice(3)}</FeedMore>
          </div>
        )}
      </div>

      {/* ── PRAWA SZYNA ── */}
      <aside className="home-aside">
        {/* Świeże konto dostaje listę kroków zamiast pięciu osobnych „nic tu nie ma".
            Znika sama, gdy wszystko odhaczone. */}
        {onboarding?.pokazuj && <PierwszeKroki stan={onboarding} />}

        {p ? (
          <>
            {/* Profil mini z licznikami (Obserwujący/Obserwowani/Runy) */}
            <div className="note me-card pin-synced">
              <div className="me-head">
                <div className="avatar sm pfp-frame">
                  <ProfileAvatar
                    fallbackSrc={ikonaPostaci(p.ulubiona || ja?.avatar || 'Isaac')}
                    avatar={ja?.avatar}
                    dekoracja={(ja?.dekoracja ?? 'none') as DecorId}
                  />
                </div>
                <div className="me-id">
                  <h3>{p.nick}</h3>
                  <span className="muted small">
                    <Sprite name="deadgod" size={16} /> Dead God
                  </span>
                </div>
              </div>
              {/* Skrót do sieci — te same liczby co u Znajomych, żeby Pulpit i Znajomi
                  mówili jednym głosem (a nie były dwiema osobnymi apkami). */}
              <div className="me-siec">
                <Link href="/znajomi">
                  <b>{liczniki.znajomi}</b> znajomych
                </Link>
                <Link href="/znajomi">
                  <b>{liczniki.obserwujacych}</b> obserwujących
                </Link>
              </div>
              <Link className="small" href="/profil">
                → Mój profil
              </Link>
            </div>

            {/* Progress */}
            <div className="note">
              <div className="feed-head">
                <h3>Postęp</h3>
              </div>
              <p className="small muted">Dead God</p>
              <div className="prog-row">
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
                </div>
                <b className="prog-pct">{p.achProcent}%</b>
              </div>
            </div>
          </>
        ) : gosc ? (
          // Gość: zamiast cudzego profilu — zaproszenie, ale z pokazaniem, co działa bez konta.
          <div className="note me-card">
            <ZalogujStan
              maly
              tekst={
                <>
                  <b>Tu zamieszka Twój save file.</b> Załóż konto, a to miejsce wypełni Twój postęp,
                  Dead God i najrzadsze zdobycze.
                </>
              }
              cta="Załóż konto"
              poza={
                <>
                  Bez konta i tak zwiedzisz <Link href="/encyklopedia">Encyklopedię</Link> (717
                  itemów) i policzysz build w <Link href="/kalkulator">Kalkulatorze</Link>.
                </>
              }
            />
          </div>
        ) : null}

        {/* Wyzwanie dnia (Basement Radio) — wspólne, widać je i bez konta. */}
        <BasementRadio />

        {/* Trending / najrzadsze */}
        {p && p.showcase.length > 0 && (
          <div className="note">
            <div className="feed-head">
              <h3>Trendujace (najrzadsze)</h3>
              <Link className="paper-more" href="/statystyki">
                Wszystkie →
              </Link>
            </div>
            <ol className="trend-list">
              {p.showcase.slice(0, 3).map((a, i) => (
                <li key={a.nazwa}>
                  <span className="trend-rank">{i + 1}.</span>
                  {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                  <span className="grow">{a.nazwa}</span>
                  <b>{a.p}%</b>
                </li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </section>
  )
}
