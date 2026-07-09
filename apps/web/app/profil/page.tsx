import Link from 'next/link'
import { getProfil, getDashboard } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import FavItemBadge from '@/components/FavItemBadge'

export const dynamic = 'force-dynamic'

export default async function ProfilPage() {
  const [p, dash] = await Promise.all([getProfil(), getDashboard()])
  if (!p) {
    return (
      <section>
        <div className="note">
          <p>Brak profilu. Zseeduj bazę i zsynchronizuj Steam.</p>
        </div>
      </section>
    )
  }

  const rarest = p.showcase[0] ? `${p.showcase[0].p}%` : '—'
  const ulubionaPostac = p.ulubiona || p.fav?.nazwa || 'Isaac'

  return (
    <section className="profil-page">
      <div className="profile-grid">
        {/* ── Lewa kolumna ── */}
        <div className="col-main">
          {/* Hero: portret + tożsamość + pasek Dead God */}
          <div className="profil-hero">
            <div className="avatar">
              <ProfileAvatar fallbackSrc={ikonaPostaci(p.ulubiona || 'Isaac')} />
            </div>
            <div className="profil-id">
              <h1>{p.nick}</h1>
              {p.opis && <p className="small opis-txt">„{p.opis}"</p>}
              <p className="badges">
                <span className="badge">
                  <Sprite name="deadgod" size={18} /> Dead God {p.achProcent}%
                </span>
                <span className="badge">
                  <Sprite name="trophy" size={18} /> {p.achUnlocked}/{p.achTotal} achiev.
                </span>
                <span className="badge">
                  <img className="badge-ava" src={ikonaPostaci(ulubionaPostac)} alt="" /> Ulubiona:{' '}
                  {ulubionaPostac}
                </span>
                <FavItemBadge />
                <span className="badge">
                  <Sprite name="friendfinder" size={18} /> 28 obserwujących
                </span>
                <span className="badge">
                  <Sprite name="friends" size={18} /> 14 obserwowanych
                </span>
              </p>
              <p className="small">
                <Link href="/kim-jestem">Edytuj profil</Link> · Steam: {p.steamId}
              </p>
            </div>
          </div>

          {/* Dead God progress — jak „DEAD GOD PROGRESS" w grze */}
          <div className="note hero-progress-card pin-synced">
            <h2>
              <Sprite name="deadgod" size={24} /> Dead God — postęp
            </h2>
            <div className="hero-progress">
              <div className="bar">
                <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
              </div>
              <span className="hero-pct">{p.achProcent}%</span>
            </div>
          </div>

          {/* Kafelki statystyk — jak licznik save-file */}
          <div className="stat-tiles">
            <div className="stat-tile">
              <Sprite name="trophy" size={30} />
              <span className="stat-num">
                {p.achUnlocked}/{p.achTotal}
              </span>
              <span className="stat-label">achievementy</span>
            </div>
            <div className="stat-tile">
              <Sprite name="starmark" size={30} />
              <span className="stat-num">{dash.overall.procent}%</span>
              <span className="stat-label">completion</span>
            </div>
            <div className="stat-tile">
              <Sprite name="heartmark" size={30} />
              <span className="stat-num">{p.marksTotal}</span>
              <span className="stat-label">marki</span>
            </div>
            <div className="stat-tile">
              <Sprite name="membercard" size={30} />
              <span className="stat-num">{rarest}</span>
              <span className="stat-label">najrzadszy</span>
            </div>
          </div>

          {/* Gablota najrzadszych — jak „FAVORITE ITEMS" */}
          {p.showcase.length > 0 && (
            <div className="note pin-featured">
              <h2>
                <Sprite name="membercard" size={24} /> Gablota (najrzadsze)
              </h2>
              <div className="showcase">
                {p.showcase.map((a) => (
                  <div key={a.nazwa} className="show-item rare" title={`${a.nazwa} · ${a.p}%`}>
                    {a.ikonaUrl && <img src={a.ikonaUrl} alt={a.nazwa} />}
                    <span className="show-p">{a.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Prawa kolumna ── */}
        <div className="col-side">
          {/* Ulubiona postać — duży portret-głowa (jak thumbs-up na ekranie postaci) */}
          <div className="note fav-char-card">
            <h2>
              <Sprite name="isaacHead" size={22} /> Ulubiona postać
            </h2>
            <div className="fav-char">
              <div className="fav-char-portrait">
                <img src={ikonaPostaci(p.ulubiona || 'Isaac')} alt={p.ulubiona || 'Isaac'} />
              </div>
              <div className="fav-char-name">{p.ulubiona || p.fav?.nazwa || 'Isaac'}</div>
            </div>
          </div>

          {/* Ostatnio odblokowane — jak „RECENT ACHIEVEMENTS" */}
          {p.recent.length > 0 && (
            <div className="note">
              <h2>
                <Sprite name="stopwatch" size={26} /> Ostatnio odblokowane
              </h2>
              <ul className="activity">
                {p.recent.map((a) => (
                  <li key={a.nazwa}>
                    {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                    <span className="grow">{a.nazwa}</span>
                    <span className="muted small">
                      {new Date(a.data).toLocaleDateString('pl-PL')}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="small">
                <Link href="/kolekcja">→ Cała kolekcja</Link>
              </p>
            </div>
          )}

          {/* Postępy postaci — jak „CHARACTER COMPLETION" */}
          <div className="note">
            <h2>
              <Sprite name="chad" size={26} /> Postępy postaci
            </h2>
            <div className="char-grid">
              {dash.postacie.map((c) => (
                <Link
                  key={c.nazwa}
                  href={`/profil/${encodeURIComponent(c.nazwa)}`}
                  className="char-cell"
                >
                  <img src={ikonaPostaci(c.nazwa)} alt="" />
                  <span className="nm">{c.nazwa}</span>
                  <span className="pct">{c.procent}%</span>
                </Link>
              ))}
            </div>
            <p className="small">
              <Link href="/statystyki">→ Wszystkie statystyki</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
