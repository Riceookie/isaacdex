import Sprite from '@/components/Sprite'
import FeedCard from '@/components/FeedCard'
import FeedMore from '@/components/FeedMore'
import { getFeedIkony } from '@/lib/queries'
import { FEED } from '@/lib/feed'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Znajomi — IsaacDex' }

export default async function ZnajomiPage() {
  const unlockCount = FEED.filter((w) => w.typ === 'unlock').length
  const ikony = await getFeedIkony(unlockCount)
  let ui = 0
  // Feed policzony raz (ikony z licznika `ui`), potem podzielony na widoczne + zwijane,
  // żeby lista znajomych mieściła się w oknie bez scrolla strony.
  const feedNodes = FEED.map((w, i) => {
    const ach = w.typ === 'unlock' ? ikony[ui++ % Math.max(1, ikony.length)] : undefined
    return <FeedCard key={i} w={w} ach={ach} />
  })

  return (
    <section>
      <p className="banner demo">
        <Sprite name="bomb" size={18} /> DEMO — przykładowi znajomi. Ikony achievementów są
        prawdziwe (ze Steama). Konta i obserwowanie dojdą w projekcie końcowym.
      </p>

      <div className="feed">
        {feedNodes.slice(0, 4)}
        <FeedMore count={feedNodes.length - 4}>{feedNodes.slice(4)}</FeedMore>
      </div>
    </section>
  )
}
