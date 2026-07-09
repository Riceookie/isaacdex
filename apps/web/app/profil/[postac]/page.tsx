import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostacMarks } from '@/lib/queries'
import MarksBoard from '@/components/MarksBoard'

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

  return (
    <section>
      <p className="small">
        <Link href="/">← Pulpit</Link>
      </p>

      <MarksBoard
        postac={data.postac}
        bossy={data.bossy}
        zaznaczone={data.zaznaczone}
        labels={BOSS_LABEL}
        roster={data.roster}
      />
    </section>
  )
}
