import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostacMarks } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import MarksGrid from '@/components/MarksGrid'

export const dynamic = 'force-dynamic'

export default async function ProfilPostaci({ params }: { params: { postac: string } }) {
  const data = await getPostacMarks(decodeURIComponent(params.postac))
  if (!data) notFound()

  return (
    <section>
      <p className="small">
        <Link href="/">← Dashboard</Link>
      </p>
      <div className="postac-head">
        <img className="char-icon big" src={ikonaPostaci(data.postac)} alt="" />
        <div>
          <h1>{data.postac}</h1>
          <p className="muted small">
            {data.zaznaczone.length}/{data.bossy.length * data.tryby.length} marek ·{' '}
            {Math.round((data.zaznaczone.length / (data.bossy.length * data.tryby.length)) * 100)}%
            ukończenia
          </p>
        </div>
      </div>
      <p className="muted small">
        Zaznacz zaliczone bossy (Normal / Hard). Reguła: HARD dopiero po NORMAL.
      </p>
      <MarksGrid
        postac={data.postac}
        bossy={data.bossy}
        tryby={data.tryby}
        zaznaczone={data.zaznaczone}
      />
    </section>
  )
}
