import { ikonaPostaci } from '@/lib/chars'
import { getFeedIkony } from '@/lib/queries'
import Sprite from '@/components/Sprite'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Znajomi — IsaacDex' }

type Wpis = {
  user: string
  postac: string
  akcja: string
  czas: string
  lajki: number
}

// DEMO — przykładowi „obserwowani". Prawdziwy feed (konta + obserwowanie) = zadanie 9.
// Ikonę odblokowanego achievementu bierzemy z prawdziwych danych Steam (getFeedIkony).
const FEED: Wpis[] = [
  { user: 'Jake', postac: 'Cain', akcja: 'odblokował', czas: '2 min temu', lajki: 14 },
  { user: 'Sarah', postac: 'Bethany', akcja: 'odblokowała', czas: '38 min temu', lajki: 6 },
  { user: 'Mike', postac: 'Azazel', akcja: 'zdobył', czas: '2 godz temu', lajki: 27 },
  { user: 'Ola', postac: 'Lilith', akcja: 'odblokowała', czas: '5 godz temu', lajki: 9 },
  { user: 'Kuba', postac: 'The Lost', akcja: 'odblokował', czas: 'wczoraj', lajki: 41 },
  { user: 'Nina', postac: 'Eden', akcja: 'odblokowała', czas: 'wczoraj', lajki: 3 },
]

export default async function ZnajomiPage() {
  const ikony = await getFeedIkony(FEED.length)

  return (
    <section>
      <p className="banner demo">
        <Sprite name="bomb" size={18} /> DEMO — przykladowi znajomi. Ikony achievementow sa
        prawdziwe (ze Steama). Konta i obserwowanie dojda w projekcie koncowym.
      </p>

      <div className="feed">
        {FEED.map((w, i) => {
          const ach = ikony[i % Math.max(1, ikony.length)]
          return (
            <div key={i} className="feed-item">
              <div className="feed-avatar">
                <img className="avatar-img" src={ikonaPostaci(w.postac)} alt="" />
              </div>
              <div className="feed-body">
                <p>
                  <span className="feed-user">{w.user}</span> {w.akcja}{' '}
                  <span className="feed-cel">
                    {ach && <img className="feed-ach" src={ach.ikonaUrl} alt="" />}
                    {ach ? ach.nazwa : 'achievement'}
                  </span>
                </p>
                <span className="muted small">
                  gra jako {w.postac} · {w.czas}
                </span>
              </div>
              <button className="feed-like" type="button" data-tip="Polub">
                <Sprite name="heart" size={20} /> {w.lajki}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
