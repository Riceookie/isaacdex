import { ikonaPostaci } from '@/lib/chars'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Znajomi — IsaacDex' }

type Wpis = {
  user: string
  postac: string
  akcja: string
  cel: string
  emoji: string
  czas: string
  lajki: number
}

// DEMO — przykładowi „obserwowani" i ich aktywność (dane testowe).
// Prawdziwy feed (konta wielu userów + obserwowanie) = zadanie 9.
const FEED: Wpis[] = [
  { user: 'Jake', postac: 'Cain', akcja: 'odblokował', cel: 'Dead God', emoji: '🪽', czas: '2 min temu', lajki: 14 },
  { user: 'Sarah', postac: 'Bethany', akcja: 'ukończyła', cel: 'Jacob & Esau (Hard)', emoji: '💀', czas: '38 min temu', lajki: 6 },
  { user: 'Mike', postac: 'Azazel', akcja: 'zdobył', cel: 'Godhead', emoji: '😇', czas: '2 godz temu', lajki: 27 },
  { user: 'Ola', postac: 'Lilith', akcja: 'zdobyła rzadki', cel: 'The Tick (1.2%)', emoji: '🏆', czas: '5 godz temu', lajki: 9 },
  { user: 'Kuba', postac: 'The Lost', akcja: 'ukończył', cel: 'Mega Satan jako The Lost', emoji: '👻', czas: 'wczoraj', lajki: 41 },
  { user: 'Nina', postac: 'Eden', akcja: 'osiągnęła', cel: '100% u Apollyona', emoji: '⭐', czas: 'wczoraj', lajki: 3 },
]

export default function ZnajomiPage() {
  return (
    <section>
      <h1>👥 Znajomi</h1>
      <p className="banner demo">🔴 DEMO — przykładowi znajomi. Prawdziwe konta i obserwowanie dojdą w projekcie końcowym.</p>

      <div className="feed">
        {FEED.map((w, i) => (
          <div key={i} className="feed-item">
            <div className="feed-avatar">
              <img className="avatar-img" src={ikonaPostaci(w.postac)} alt="" />
            </div>
            <div className="feed-body">
              <p>
                <span className="feed-user">{w.user}</span> {w.akcja}{' '}
                <span className="feed-cel">
                  {w.emoji} {w.cel}
                </span>
              </p>
              <span className="muted small">gra jako {w.postac} · {w.czas}</span>
            </div>
            <button className="feed-like" type="button" data-tip="Polub">
              ❤ {w.lajki}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
