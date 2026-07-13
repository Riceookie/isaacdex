import Link from 'next/link'
import { getProfil, getFeedIkony } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import FeedCard from '@/components/FeedCard'
import FeedMore from '@/components/FeedMore'
import BasementRadio from '@/components/BasementRadio'
import { FEED } from '@/lib/feed'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const wpisyUnlock = FEED.slice(0, 6).filter((w) => w.typ === 'unlock').length
  const [p, ikony] = await Promise.all([getProfil(), getFeedIkony(wpisyUnlock)])

  if (!p) {
    return (
      <section>
        <h1>IsaacDex</h1>
        <div className="note">
          <p>Brak profilu. Zseeduj bazę i zsynchronizuj Steam w Kolekcji.</p>
        </div>
      </section>
    )
  }

  let ui = 0
  // Feed liczony raz (ikony achievementów z licznika `ui`), potem dzielony na
  // widoczne od razu + zwijane, żeby Pulpit mieścił się w oknie bez scrolla strony.
  const feedNodes = FEED.slice(0, 6).map((w, i) => {
    const ach = w.typ === 'unlock' ? ikony[ui++ % Math.max(1, ikony.length)] : undefined
    return <FeedCard key={i} w={w} ach={ach} />
  })

  return (
    <section className="home-grid">
      {/* ── GŁÓWNA KOLUMNA ── */}
      <div className="home-feed">
        <div className="feed-head">
          <h2>
            <Sprite name="friendfinder" size={26} /> Co slychac?
          </h2>
          <Link className="small" href="/znajomi">
            → Wszyscy znajomi
          </Link>
        </div>

        <p className="banner demo">
          <Sprite name="bomb" size={16} /> DEMO — przykładowy feed. Ikony achievementów prawdziwe
          (Steam). Konta i obserwowanie w projekcie końcowym.
        </p>

        <div className="feed">
          {feedNodes.slice(0, 3)}
          <FeedMore count={feedNodes.length - 3}>{feedNodes.slice(3)}</FeedMore>
        </div>
      </div>

      {/* ── PRAWA SZYNA ── */}
      <aside className="home-aside">
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
          <Link className="small" href="/profil">
            → Mój profil
          </Link>
        </div>

        {/* Progress */}
        <div className="note">
          <div className="feed-head">
            <h3>Postep</h3>
          </div>
          <p className="small muted">Dead God</p>
          <div className="prog-row">
            <div className="bar">
              <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
            </div>
            <b className="prog-pct">{p.achProcent}%</b>
          </div>
        </div>

        {/* Wyzwanie dnia (Basement Radio) */}
        <BasementRadio />

        {/* Trending / najrzadsze */}
        {p.showcase.length > 0 && (
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

        <Link className="btn full" href="/encyklopedia/przedmioty">
          <Sprite name="foundsoul" size={20} /> Doradca itemów
        </Link>
      </aside>
    </section>
  )
}
