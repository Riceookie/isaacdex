import Link from 'next/link'
import { getProfil, getDashboard } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [p, dash] = await Promise.all([getProfil(), getDashboard()])

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

  return (
    <section>
      {/* Pasek profilu + Dead God */}
      <div className="profil-hero">
        <div className="avatar">
          <img className="avatar-img" src={ikonaPostaci(p.ulubiona || 'Isaac')} alt="" />
        </div>
        <div className="profil-id">
          <h1>{p.nick}</h1>
          <p className="muted small">💀 Dead God — {p.achProcent}% achievementów</p>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
          </div>
        </div>
      </div>

      {/* Kluczowe liczby */}
      <div className="tiles">
        <div className="tile">
          <span className="tile-num">
            {p.achUnlocked}/{p.achTotal}
          </span>
          <span className="muted small">achievementy</span>
        </div>
        <div className="tile">
          <span className="tile-num">{dash.overall.procent}%</span>
          <span className="muted small">completion marks</span>
        </div>
        <div className="tile">
          <span className="tile-num">{p.marksTotal}</span>
          <span className="muted small">zdobyte marki</span>
        </div>
        <div className="tile">
          <span className="tile-num">🏆 {p.showcase[0] ? `${p.showcase[0].p}%` : '—'}</span>
          <span className="muted small">najrzadszy</span>
        </div>
      </div>

      {/* Dwie kolumny: ostatnie + postacie */}
      <div className="dash-cols">
        <div className="note">
          <h2>🕒 Ostatnio odblokowane</h2>
          <ul className="activity">
            {p.recent.slice(0, 5).map((a) => (
              <li key={a.nazwa}>
                {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                <span className="grow">{a.nazwa}</span>
                <span className="muted small">{new Date(a.data).toLocaleDateString('pl-PL')}</span>
              </li>
            ))}
          </ul>
          <p className="small">
            <Link href="/kolekcja">→ Cała kolekcja</Link>
          </p>
        </div>

        <div className="note">
          <h2>👥 Postępy postaci</h2>
          <div className="char-bars">
            {dash.postacie.slice(0, 6).map((c) => (
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
          <p className="small">
            <Link href="/statystyki">→ Wszystkie statystyki</Link>
          </p>
        </div>
      </div>

      <p>
        <Link className="btn" href="/doradca">
          🎯 Doradca itemów
        </Link>
      </p>
    </section>
  )
}
