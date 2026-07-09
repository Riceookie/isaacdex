import Link from 'next/link'
import { getProfil, getDashboard, getFeedIkony } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import FeedCard from '@/components/FeedCard'
import { FEED } from '@/lib/feed'
import { seedDnia } from '@/lib/dailySeed'

export const dynamic = 'force-dynamic'

// DEMO — dane społecznościowe (realny backend = projekt końcowy).
const LEADERBOARD = [
  { user: 'VoidKing', postac: 'Azazel', czas: '00:12:43' },
  { user: 'Ananas', postac: 'Isaac', czas: '00:13:02' },
  { user: 'Lilith', postac: 'The Lost', czas: '00:13:30' },
  { user: 'BasementDweller', postac: 'Cain', czas: '00:13:59', ty: true },
  { user: 'Jorge', postac: 'Samson', czas: '00:14:21' },
]

function czasDoPolnocy(now: Date): string {
  const koniec = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  let s = Math.max(0, Math.floor((koniec - now.getTime()) / 1000))
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  s -= m * 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default async function Home() {
  const wpisyUnlock = FEED.slice(0, 5).filter((w) => w.typ === 'unlock').length
  const [p, dash, ikony] = await Promise.all([
    getProfil(),
    getDashboard(),
    getFeedIkony(wpisyUnlock),
  ])

  if (!p) {
    return (
      <section className="hub">
        <div className="paper-card">
          <p>Brak profilu. Zseeduj bazę i zsynchronizuj Steam w Kolekcji.</p>
        </div>
      </section>
    )
  }

  const teraz = new Date()
  const daily = seedDnia(teraz)
  const timeLeft = czasDoPolnocy(teraz)

  return (
    <section className="hub">
      <div className="hub-grid">
        {/* ── GŁÓWNA KOLUMNA ── */}
        <div className="hub-main">
          {/* What's happening — feed aktywności */}
          <div className="paper-card wh">
            <div className="paper-head">
              <h2>Co słychać?</h2>
              <Link className="paper-more" href="/znajomi">
                Więcej →
              </Link>
            </div>
            <div className="wh-feed">
              {(() => {
                let ui = 0
                return FEED.slice(0, 5).map((w, i) => {
                  const ach =
                    w.typ === 'unlock' ? ikony[ui++ % Math.max(1, ikony.length)] : undefined
                  return <FeedCard key={i} w={w} ach={ach} />
                })
              })()}
            </div>
            <Link className="view-more" href="/znajomi">
              Zobacz więcej ▾
            </Link>
          </div>

          {/* Dwie karty: leaderboard + run of the day */}
          <div className="hub-row2">
            <div className="paper-card lb">
              <div className="paper-head">
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

            <div className="paper-card rotd">
              <div className="paper-head">
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
        <aside className="hub-rail">
          {/* Profil mini */}
          <div className="paper-card profile-mini">
            <div className="pm-top">
              <div className="pm-photo">
                <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
              </div>
              <div className="pm-id">
                <h3>{p.nick}</h3>
                <span className="muted small">
                  <Sprite name="deadgod" size={16} /> Dead God
                </span>
                <span className="muted small">Steam: {String(p.steamId).slice(0, 8)}…</span>
              </div>
            </div>
            <div className="pm-counts">
              <span>
                <b>28</b> Obserwujący
              </span>
              <span>
                <b>14</b> Obserwowani
              </span>
              <span>
                <b>{p.marksTotal}</b> Marki
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="paper-card">
            <div className="paper-head">
              <h3>Postęp</h3>
            </div>
            <p className="small ink-muted">Dead God</p>
            <div className="prog-row">
              <div className="bar">
                <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
              </div>
              <b className="prog-pct">{p.achProcent}%</b>
            </div>
          </div>

          {/* Wyzwanie dnia */}
          <div className="paper-card">
            <div className="paper-head">
              <h3>Wyzwanie dnia</h3>
            </div>
            <div className="dc-row">
              <img className="dc-ava" src={ikonaPostaci(daily.postac)} alt="" />
              <div>
                <b>{daily.postac}</b>
                <p className="small ink-muted">
                  {daily.trudnosc} · seed {daily.seed}
                </p>
              </div>
            </div>
            <p className="small dc-time">Pozostało: {timeLeft}</p>
          </div>

          {/* Trending achievementy = najrzadsze z profilu */}
          {p.showcase.length > 0 && (
            <div className="paper-card">
              <div className="paper-head">
                <h3>Najrzadsze</h3>
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
      </div>
    </section>
  )
}
