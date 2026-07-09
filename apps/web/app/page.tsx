import Link from 'next/link'
import { getProfil, getDashboard } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import HudStat from '@/components/HudStat'
import ProfileAvatar from '@/components/ProfileAvatar'

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
          <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
        </div>
        <div className="profil-id">
          <h1>{p.nick}</h1>
          <p className="muted small">
            <Sprite name="deadgod" size={20} /> Dead God — {p.achProcent}% achievementów
          </p>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
          </div>
        </div>
      </div>

      {/* Kluczowe liczby — pasek w stylu HUD-a Isaaca */}
      <div className="hud-row">
        <HudStat icon="trophy" value={`${p.achUnlocked}/${p.achTotal}`} label="achievementy" />
        <HudStat icon="starmark" value={`${dash.overall.procent}%`} label="completion marks" />
        <HudStat icon="heartmark" value={p.marksTotal} label="zdobyte marki" />
        <HudStat
          icon="membercard"
          value={p.showcase[0] ? `${p.showcase[0].p}%` : '—'}
          label="najrzadszy"
        />
      </div>

      {/* Dwie kolumny: ostatnie + postacie */}
      <div className="dash-cols">
        <div className="note">
          <h2>
            <Sprite name="stopwatch" size={26} /> Ostatnio odblokowane
          </h2>
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
          <h2>
            <Sprite name="chad" size={26} /> Postepy postaci
          </h2>
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
          <Sprite name="foundsoul" size={22} /> Doradca itemów
        </Link>
      </p>
    </section>
  )
}
