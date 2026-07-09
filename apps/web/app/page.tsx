import Link from 'next/link'
import { getProfil, getDashboard, getFeedIkony } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import FeedCard from '@/components/FeedCard'
import BasementRadio from '@/components/BasementRadio'
import { FEED } from '@/lib/feed'

export const dynamic = 'force-dynamic'

// DEMO — dane społecznościowe (realny backend = projekt końcowy).
const LEADERBOARD = [
  { user: 'VoidKing', postac: 'Azazel', czas: '00:12:43' },
  { user: 'Ananas', postac: 'Isaac', czas: '00:13:02' },
  { user: 'Lilith', postac: 'The Lost', czas: '00:13:30' },
  { user: 'BasementDweller', postac: 'Cain', czas: '00:13:59', ty: true },
  { user: 'Jorge', postac: 'Samson', czas: '00:14:21' },
]

export default async function Home() {
  const wpisyUnlock = FEED.slice(0, 6).filter((w) => w.typ === 'unlock').length
  const [p, dash, ikony] = await Promise.all([
    getProfil(),
    getDashboard(),
    getFeedIkony(wpisyUnlock),
  ])

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

        <p className="banner demo">
          <Sprite name="bomb" size={16} /> DEMO — przykładowy feed. Ikony achievementów prawdziwe
          (Steam). Konta i obserwowanie w projekcie końcowym.
        </p>

        <div className="feed">
          {FEED.slice(0, 6).map((w, i) => {
            const ach = w.typ === 'unlock' ? ikony[ui++ % Math.max(1, ikony.length)] : undefined
            return <FeedCard key={i} w={w} ach={ach} />
          })}
        </div>

        {/* Ranking wyzwania + Run dnia obok siebie (jak mockup Home) */}
        <div className="home-row2">
          <div className="note lb-card">
            <div className="feed-head">
              <h3>Ranking wyzwania dnia</h3>
              <span className="pill-tab">GLOBAL</span>
            </div>
            <ol className="lb-list">
              {LEADERBOARD.map((r, i) => (
                <li key={r.user} className={'lb-row' + (r.ty ? ' me' : '')}>
                  <span className="lb-rank">{i + 1}.</span>
                  <img className="lb-ava" src={ikonaPostaci(r.postac)} alt="" />
                  <span className="lb-user">
                    {r.user}
                    {r.ty && ' (Ty)'}
                  </span>
                  <span className="lb-time">{r.czas}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="note rotd-card">
            <div className="feed-head">
              <h3>Run dnia</h3>
            </div>
            <div className="rotd-thumb" aria-hidden="true">
              <span className="rotd-laser" />
            </div>
            <p className="rotd-title">Szalony brim run</p>
            <p className="muted small">
              autor: <span className="feed-user">BloodMachine</span>
            </p>
            <div className="rotd-meta">
              <span>
                <Sprite name="heart" size={16} /> 312
              </span>
              <span className="feed-comments">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                >
                  <path d="M4 5h16v11H9l-4 3v-3H4z" strokeLinecap="round" />
                </svg>
                45
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRAWA SZYNA ── */}
      <aside className="home-aside">
        {/* Profil mini z licznikami (Obserwujący/Obserwowani/Runy) */}
        <div className="note me-card pin-synced">
          <div className="me-head">
            <div className="avatar sm">
              <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
            </div>
            <div className="me-id">
              <h3>{p.nick}</h3>
              <span className="muted small">
                <Sprite name="deadgod" size={16} /> Dead God
              </span>
            </div>
          </div>
          <div className="me-stats">
            <div>
              <b>28</b>
              <span className="muted small">Obserwujący</span>
            </div>
            <div>
              <b>14</b>
              <span className="muted small">Obserwowani</span>
            </div>
            <div>
              <b>342</b>
              <span className="muted small">Runy</span>
            </div>
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

        {/* Wyzwanie dnia (Basement Radio) */}
        <BasementRadio />

        {/* Trending / najrzadsze */}
        {p.showcase.length > 0 && (
          <div className="note">
            <div className="feed-head">
              <h3>Trendujące (najrzadsze)</h3>
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

        <Link className="btn full" href="/doradca">
          <Sprite name="foundsoul" size={20} /> Doradca itemów
        </Link>
      </aside>
    </section>
  )
}
