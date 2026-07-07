import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostacMarks } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'

export const dynamic = 'force-dynamic'

const BOSS_LABEL: Record<string, string> = {
  MOMS_HEART: "Mom's Heart",
  ISAAC: 'Isaac',
  SATAN: 'Satan',
  BLUE_BABY: '???',
  LAMB: 'The Lamb',
  MEGA_SATAN: 'Mega Satan',
  BOSS_RUSH: 'Boss Rush',
  HUSH: 'Hush',
  DELIRIUM: 'Delirium',
  MOTHER: 'Mother',
  BEAST: 'The Beast',
}

export default async function ProfilPostaci({ params }: { params: { postac: string } }) {
  const data = await getPostacMarks(decodeURIComponent(params.postac))
  if (!data) notFound()

  const done = new Set(data.zaznaczone.map((z) => z.split(':')[0]))
  const total = data.bossy.length
  const doneCount = data.bossy.filter((b) => done.has(b)).length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <section>
      <p className="small">
        <Link href="/">← Pulpit</Link>
      </p>

      <div className="savefile">
        <div className="savefile-head">
          <img className="char-icon big" src={ikonaPostaci(data.postac)} alt="" />
          <div>
            <h1>{data.postac}</h1>
            <p className="muted small">
              {doneCount}/{total} completion marks · {pct}%
            </p>
          </div>
        </div>

        <div className="marks-grid">
          {data.bossy.map((b) => {
            const on = done.has(b)
            return (
              <div key={b} className={'mark-cell' + (on ? ' on' : '')} data-tip={BOSS_LABEL[b] || b}>
                <img src={`/tboi/marks/${b}.webp`} alt={BOSS_LABEL[b] || b} />
              </div>
            )
          })}
        </div>

        <p className="muted small">
          Marki wyliczają się automatycznie z Twoich achievementów (Steam). Czerwone = Hard.
        </p>
      </div>
    </section>
  )
}
