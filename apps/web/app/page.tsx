import Link from 'next/link'
import { getProfil } from '@/lib/queries'
import { getFeed, getLicznikiSpoleczne } from '@/lib/social'
import { czyZalogowany } from '@/lib/konto'
import { ikonaPostaci } from '@/lib/chars'
import { PUSTKA } from '@/lib/klimat'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
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
  const [zalogowany, p, feed, liczniki] = await Promise.all([
    czyZalogowany(),
    getProfil(),
    getFeed(zakres),
    getLicznikiSpoleczne(),
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
          <PustyStan
            tekst={brakZnajomych ? PUSTKA.brakZnajomych : PUSTKA.brakAktywnosci}
            akcja={
              <Link className="btn" href={brakZnajomych ? '/znajomi' : '/?feed=global'}>
                {brakZnajomych ? 'Znajdź graczy' : 'Zobacz feed globalny'}
              </Link>
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
        {p ? (
          <>
            {/* Profil mini z licznikami (Obserwujący/Obserwowani/Runy) */}
            <div className="note me-card pin-synced">
              <div className="me-head">
                <div className="avatar sm pfp-frame">
                  <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
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
        ) : (
          // Gość albo konto bez Steama: zamiast cudzego profilu — zaproszenie do logowania.
          <div className="note me-card">
            {gosc ? (
              <ZalogujStan
                maly
                tekst={
                  <>
                    <b>Tu zamieszka Twój save file.</b> Zaloguj się, a pojawi się profil, postęp i
                    Twoje najrzadsze achievementy.
                  </>
                }
                cta="Załóż konto"
              />
            ) : (
              <PustyStan
                maly
                tekst={
                  <>
                    <b>Pusto tu jak w Curse of the Blind.</b> Podłącz Steam, a Twój postęp wskoczy
                    tutaj.
                  </>
                }
                akcja={
                  <Link className="btn" href="/kim-jestem">
                    Podłącz Steam
                  </Link>
                }
              />
            )}
          </div>
        )}

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
