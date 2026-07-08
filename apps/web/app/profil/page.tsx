import Link from 'next/link'
import { getProfil } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'

export const dynamic = 'force-dynamic'

export default async function ProfilPage() {
  const p = await getProfil()
  if (!p) {
    return (
      <section>
        <h1>Profil</h1>
        <div className="note">
          <p>Brak profilu. Zseeduj bazę i zsynchronizuj Steam.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      {/* Hero „WHO AM I?" na papierze z krwią */}
      <div className="profil-hero">
        <div className="avatar">
          <img className="avatar-img" src={ikonaPostaci(p.ulubiona || 'Isaac')} alt="" />
        </div>
        <div className="profil-id">
          <h1>{p.nick}</h1>
          {p.opis && <p className="small opis-txt">„{p.opis}"</p>}
          <p className="small">
            Ulubiona: <b>{p.ulubiona || p.fav?.nazwa || '—'}</b>
            {!p.ulubiona && p.fav ? ` (${p.fav.count} marek)` : ''}
          </p>
          <p className="small">
            <Link href="/kim-jestem">Edytuj profil</Link> · Steam: {p.steamId}
          </p>
        </div>
      </div>

      {/* Dead God = 100% achievementów */}
      <div className="note">
        <h2>
          <Sprite name="skull" size={20} /> Dead God
        </h2>
        <p className="muted small">Postęp do 100% wszystkich achievementów.</p>
        <div className="big">{p.achProcent}%</div>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
        </div>
      </div>

      <div className="tiles">
        <div className="tile">
          <span className="tile-num">
            {p.achUnlocked}/{p.achTotal}
          </span>
          <span className="muted small">achievementy</span>
        </div>
        <div className="tile">
          <span className="tile-num">{p.marksTotal}</span>
          <span className="muted small">completion marks</span>
        </div>
        <div className="tile">
          <span className="tile-num">{p.showcase[0] ? `${p.showcase[0].p}%` : '—'}</span>
          <span className="muted small">najrzadszy zdobyty</span>
        </div>
      </div>

      {/* Gablota — najrzadsze zdobyte (złote ramki) */}
      {p.showcase.length > 0 && (
        <div className="note">
          <h2>
            <Sprite name="coin" size={20} /> Gablota (najrzadsze)
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

      {/* Ostatnia aktywność */}
      {p.recent.length > 0 && (
        <div className="note">
          <h2>
            <Sprite name="clock" size={18} /> Ostatnio odblokowane
          </h2>
          <ul className="activity">
            {p.recent.map((a) => (
              <li key={a.nazwa}>
                {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                <span className="grow">{a.nazwa}</span>
                <span className="muted small">{new Date(a.data).toLocaleDateString('pl-PL')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="small">
        <Link href="/kolekcja">→ Cała kolekcja</Link>
      </p>
    </section>
  )
}
