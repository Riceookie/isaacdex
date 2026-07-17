import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostacMarks } from '@/lib/queries'
import { czyZalogowany } from '@/lib/konto'
import { jestTainted } from '@/lib/chars'
import MarksBoard from '@/components/MarksBoard'
import Sprite from '@/components/Sprite'

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
  const [data, zalogowany] = await Promise.all([
    getPostacMarks(decodeURIComponent(params.postac)),
    czyZalogowany(),
  ])
  if (!data) notFound()

  return (
    <section>
      <p className="small">
        <Link href="/statystyki">← Statystyki</Link>
      </p>

      {!zalogowany && (
        <p className="banner demo" role="status">
          <Sprite name="deadgod" size={16} /> Podgląd bez konta — tablica świeci pustkami.{' '}
          <Link href="/logowanie" className="banner-link">
            Zaloguj się
          </Link>
          , aby ubijać bossów i zbierać własne completion marks.
        </p>
      )}

      {jestTainted(data.postac) && data.zaznaczone.length === 0 && (
        <p className="small muted char-nodata-note">
          <Sprite name="godhead" size={14} />
          <span>
            To postać <b>splugawiona (Tainted)</b> — jej completion marks nie są achievementami
            Steam, więc Web API ich nie zwraca i tablica pozostaje pusta. Śledzimy tylko marki
            postaci bazowych.
          </span>
        </p>
      )}

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
