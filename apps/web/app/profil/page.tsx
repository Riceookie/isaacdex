import Link from 'next/link'
import { getProfil, getDashboard } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import ProfileAvatar from '@/components/ProfileAvatar'
import ItemSprite from '@/components/ItemSprite'
import FrameDecor from '@/components/FrameDecor'

export const dynamic = 'force-dynamic'

// DEMO — statystyki gry (runy/wygrane/śmierci) nie są śledzone przez API Steam,
// więc mockowane; feed/znajomi też mock. Realne w projekcie końcowym.
const RECENT_RUNS = [
  {
    wynik: 'WYGRANA',
    boss: 'Delirium',
    czas: '28:42',
    piętro: 'Home',
    seed: 'KJ4D 82LS',
    itemy: ['Sacred Heart', 'Brimstone', 'Tech X'],
  },
  {
    wynik: 'PORAŻKA',
    boss: '???',
    czas: '19:18',
    piętro: 'Sheol',
    seed: '7XQ3 K2B1',
    itemy: ['Ipecac', 'Incubus'],
  },
  {
    wynik: 'WYGRANA',
    boss: 'Ultra Greed',
    czas: '23:11',
    piętro: 'Greed',
    seed: 'BXA8 J1F2',
    itemy: ['Epic Fetus', 'Polyphemus'],
  },
  {
    wynik: 'WYGRANA',
    boss: 'Mother',
    czas: '32:07',
    piętro: 'Womb II',
    seed: 'Y9RL QP8M',
    itemy: ["Mom's Knife", 'Magic Mushroom'],
  },
]

const FRIENDS = [
  { user: 'VoidKing', postac: 'Azazel', status: 'Online', on: true },
  { user: 'Ananas', postac: 'Isaac', status: 'W trakcie runu', on: true },
  { user: 'Lilith', postac: 'The Lost', status: 'Offline', on: false },
  { user: 'Jorge', postac: 'Samson', status: 'Offline', on: false },
]

const FAV_ITEMS = ['Sacred Heart', 'Brimstone', '20/20', 'Godhead', 'Tech X']

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

  const ulubionaPostac = p.ulubiona || p.fav?.nazwa || 'Isaac'

  return (
    <section className="pf-page">
      <div className="pf-grid">
        {/* ── LEWA KOLUMNA ── */}
        <div className="pf-main">
          {/* Karta profilu (polaroid + tożsamość + meta) */}
          <div className="profil-hero pf-hero pin-synced">
            <FrameDecor kind="spider" pos="tr" />
            <div className="pf-photo">
              <ProfileAvatar fallbackSrc={ikonaPostaci(ulubionaPostac)} />
            </div>
            <div className="pf-id">
              <h1>
                {p.nick}{' '}
                <Link className="pf-edit" href="/kim-jestem" aria-label="Edytuj profil">
                  ✎
                </Link>
              </h1>
              <span className="pf-handle">#{String(p.steamId).slice(-4)}</span>
              <p className="pf-bio">„{p.opis || 'Za dużo gram w Isaaca. Ratunku.'}"</p>
              <p className="badges">
                <span className="badge">
                  <Sprite name="deadgod" size={18} /> Dead God {p.achProcent}%
                </span>
                <span className="badge">
                  <img className="badge-ava" src={ikonaPostaci(ulubionaPostac)} alt="" />{' '}
                  {ulubionaPostac} main
                </span>
              </p>
            </div>
            <div className="pf-meta">
              <div>
                <span className="muted small">CZŁONEK OD</span>
                <b>Sty 2023</b>
              </div>
              <div>
                <span className="muted small">REGION</span>
                <b>Europa</b>
              </div>
              <div>
                <span className="muted small">STEAM</span>
                <b>{String(p.steamId).slice(0, 9)}…</b>
              </div>
            </div>
          </div>

          {/* Ulubiona postać + Dead God progress obok siebie */}
          <div className="pf-favprog">
            <div className="note fav-char-card">
              <h3>Ulubiona postac</h3>
              <div className="fav-char">
                <div className="fav-char-portrait">
                  <img src={ikonaPostaci(ulubionaPostac)} alt={ulubionaPostac} />
                </div>
                <div className="fav-char-name">{ulubionaPostac}</div>
              </div>
            </div>
            <div className="note dead-god-card pin-featured">
              <h3>
                <Sprite name="deadgod" size={20} /> Dead God — postep
              </h3>
              <div className="hero-progress">
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${p.achProcent}%` }} />
                </div>
                <span className="hero-pct">{p.achProcent}%</span>
              </div>
              <p className="small muted">
                {p.achUnlocked}/{p.achTotal} achievementów
              </p>
            </div>
          </div>

          {/* Recent Runs */}
          <div className="note recent-runs">
            <div className="paper-head">
              <h2>
                <Sprite name="stopwatch" size={24} /> Ostatnie runy
              </h2>
              <span className="muted small">DEMO</span>
            </div>
            <div className="runs-list">
              {RECENT_RUNS.map((r, i) => (
                <div key={i} className="run-row">
                  <span className={'run-result ' + (r.wynik === 'WYGRANA' ? 'win' : 'loss')}>
                    {r.wynik}
                    <span className="muted small">
                      {r.wynik === 'WYGRANA' ? 'vs' : 'do'} {r.boss}
                    </span>
                  </span>
                  <span className="run-time">{r.czas}</span>
                  <span className="run-seed">
                    <span className="muted small">{r.piętro}</span>
                    <code>{r.seed}</code>
                  </span>
                  <span className="run-items">
                    {r.itemy.map((it) => (
                      <ItemSprite key={it} nazwa={it} size={26} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRAWA KOLUMNA ── */}
        <div className="pf-side">
          {/* Recent Achievements */}
          {p.recent.length > 0 && (
            <div className="note">
              <div className="paper-head">
                <h3>
                  <Sprite name="trophy" size={22} /> Ostatnie achievementy
                </h3>
                <Link className="paper-more" href="/kolekcja">
                  Wszystkie →
                </Link>
              </div>
              <ul className="ra-list">
                {p.recent.slice(0, 4).map((a) => (
                  <li key={a.nazwa}>
                    {a.ikonaUrl && <img src={a.ikonaUrl} alt="" />}
                    <span className="grow">{a.nazwa}</span>
                    <span className="muted small">
                      {new Date(a.data).toLocaleDateString('pl-PL')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Favorite Items */}
          <div className="note">
            <div className="paper-head">
              <h3>Ulubione itemy</h3>
              <Link className="paper-more" href="/doradca">
                Zmień →
              </Link>
            </div>
            <div className="fav-items">
              {FAV_ITEMS.map((it) => (
                <span key={it} className="fav-item-tile" title={it}>
                  <ItemSprite nazwa={it} size={34} />
                  <span className="small muted">{it}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Character Completion */}
          <div className="note">
            <div className="paper-head">
              <h3>
                <Sprite name="chad" size={22} /> Postepy postaci
              </h3>
              <Link className="paper-more" href="/statystyki">
                Statystyki →
              </Link>
            </div>
            <div className="char-grid">
              {dash.postacie.slice(0, 12).map((c) => (
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
          </div>

          {/* About Me */}
          <div className="note about-me">
            <h3>O mnie</h3>
            <p>{p.opis || 'Za dużo gram w Isaaca. Ślę pomoc.'}</p>
          </div>

          {/* Friends */}
          <div className="note">
            <div className="paper-head">
              <h3>
                <Sprite name="friendfinder" size={22} /> Znajomi ({FRIENDS.length})
              </h3>
              <Link className="paper-more" href="/znajomi">
                Wszyscy →
              </Link>
            </div>
            <ul className="fr-list">
              {FRIENDS.map((f) => (
                <li key={f.user}>
                  <img src={ikonaPostaci(f.postac)} alt="" />
                  <span className="grow">{f.user}</span>
                  <span className={'fr-status' + (f.on ? ' on' : '')}>{f.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
