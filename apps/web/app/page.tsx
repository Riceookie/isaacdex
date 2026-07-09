import Link from 'next/link'
import { getProfil, getDashboard, getFeedIkony } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import FeedCard from '@/components/FeedCard'
import { FEED } from '@/lib/feed'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const unlockCount = FEED.filter((w) => w.typ === 'unlock').length
  const [p, dash, ikony] = await Promise.all([
    getProfil(),
    getDashboard(),
    getFeedIkony(unlockCount),
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

  // Prawdziwe ikony achievementów przypisujemy kolejnym wpisom typu „unlock".
  let ui = 0

  return (
    <section className="home-grid">
      {/* GŁÓWNA KOLUMNA — aktywność znajomych (gwiazda strony). */}
      <div className="home-feed">
        <div className="feed-head">
          <h2>
            <Sprite name="friendfinder" size={26} /> Aktywność znajomych
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
          {FEED.map((w, i) => {
            const ach = w.typ === 'unlock' ? ikony[ui++ % Math.max(1, ikony.length)] : undefined
            return <FeedCard key={i} w={w} ach={ach} />
          })}
        </div>
      </div>

      {/* PRAWA SZYNA — Twoje statystyki (profil zszedł z pierwszego planu). */}
      <aside className="home-aside">
        <div className="note me-card pin-synced">
          <div className="me-head">
            <div className="avatar sm">
              <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
            </div>
            <div className="me-id">
              <h3>{p.nick}</h3>
              <span className="muted small">
                <Sprite name="deadgod" size={16} /> Dead God {p.achProcent}%
              </span>
            </div>
          </div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
          </div>
          <div className="me-stats">
            <div>
              <b>
                {p.achUnlocked}/{p.achTotal}
              </b>
              <span className="muted small">achiev.</span>
            </div>
            <div>
              <b>{dash.overall.procent}%</b>
              <span className="muted small">completion</span>
            </div>
            <div>
              <b>{p.marksTotal}</b>
              <span className="muted small">marki</span>
            </div>
          </div>
          <Link className="small" href="/profil">
            → Mój profil
          </Link>
        </div>

        <div className="note">
          <h3>
            <Sprite name="chad" size={22} /> Twoje postępy
          </h3>
          <div className="char-bars">
            {dash.postacie.slice(0, 5).map((c) => (
              <div key={c.nazwa} className="char-bar">
                <img className="char-icon" src={ikonaPostaci(c.nazwa)} alt="" />
                <Link className="char-name" href={`/profil/${encodeURIComponent(c.nazwa)}`}>
                  {c.nazwa}
                </Link>
                <div className="bar mini">
                  <div className="bar-fill" style={{ width: `${c.procent}%` }} />
                </div>
                <span className="char-pct">{c.procent}%</span>
              </div>
            ))}
          </div>
          <Link className="small" href="/statystyki">
            → Wszystkie statystyki
          </Link>
        </div>

        <Link className="btn full" href="/doradca">
          <Sprite name="foundsoul" size={20} /> Doradca itemów
        </Link>
      </aside>
    </section>
  )
}
