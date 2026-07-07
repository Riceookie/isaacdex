import Link from 'next/link'
import { getDashboard } from '@/lib/queries'
import AdvisorForm from '@/components/AdvisorForm'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { overall, postacie, profil } = await getDashboard()

  return (
    <section>
      <h1>Postęp ukończenia</h1>
      <p className="muted small">Profil: {profil?.nick ?? '—'}</p>

      <div className="big">
        {overall.procent}%
        <span className="muted small">
          {' '}
          ({overall.zaliczone}/{overall.wszystkie} completion marks)
        </span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${overall.procent}%` }} />
      </div>

      <h2>🎯 Doradca itemów — brać czy zostawić?</h2>
      <AdvisorForm />

      <h2>👥 Postacie</h2>
      <ul className="list">
        {postacie.map((p) => (
          <li key={p.nazwa} className="item">
            <Link href={`/profil/${encodeURIComponent(p.nazwa)}`} className="grow">
              {p.nazwa}
            </Link>
            <span className="muted small">{p.procent}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
