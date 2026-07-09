import Link from 'next/link'
import { getStatystyki, getDashboard } from '@/lib/queries'
import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'

export const dynamic = 'force-dynamic'

// ── Wykres: skumulowane odblokowania w czasie (jedna seria → kolor akcentu) ──
function WykresCzas({ seria }: { seria: { m: string; cum: number }[] }) {
  if (seria.length < 2) {
    return <p className="muted small">Za mało danych z datami, żeby narysować wykres.</p>
  }
  const W = 680
  const H = 210
  const pad = { l: 34, r: 12, t: 12, b: 26 }
  const max = seria[seria.length - 1].cum
  const n = seria.length
  const x = (i: number) => pad.l + (i / (n - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b)

  const linia = seria.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.cum)}`).join(' ')
  const obszar = `${linia} L${x(n - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Odblokowania w czasie">
      <line className="chart-axis" x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} />
      <line className="chart-axis" x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} />
      <text
        className="chart-txt"
        x={pad.l - 6}
        y={y(max)}
        textAnchor="end"
        dominantBaseline="middle"
      >
        {max}
      </text>
      <text
        className="chart-txt"
        x={pad.l - 6}
        y={H - pad.b}
        textAnchor="end"
        dominantBaseline="middle"
      >
        0
      </text>
      <path className="chart-area" d={obszar} />
      <path className="chart-line" d={linia} />
      {seria.map((p, i) => (
        <circle key={p.m} className="chart-dot" cx={x(i)} cy={y(p.cum)} r={3}>
          <title>{`${p.m}: ${p.cum} odblokowanych`}</title>
        </circle>
      ))}
      <text className="chart-txt" x={pad.l} y={H - 8}>
        {seria[0].m}
      </text>
      <text className="chart-txt" x={W - pad.r} y={H - 8} textAnchor="end">
        {seria[n - 1].m}
      </text>
    </svg>
  )
}

// ── Wykres: rzadkość Twoich odblokowanych (3 kubełki, legendarne = złoto) ──
function WykresRzadkosc({ b }: { b: { legendarne: number; rzadkie: number; czeste: number } }) {
  const dane = [
    { label: 'Częste', pod: '>20%', v: b.czeste, gold: false },
    { label: 'Rzadkie', pod: '5–20%', v: b.rzadkie, gold: false },
    { label: 'Legendarne', pod: '<5%', v: b.legendarne, gold: true },
  ]
  const W = 680
  const H = 210
  const pad = { t: 24, b: 40 }
  const max = Math.max(1, ...dane.map((d) => d.v))
  const bw = 120
  const gap = (W - dane.length * bw) / (dane.length + 1)
  const h = (v: number) => (v / max) * (H - pad.t - pad.b)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Rzadkość odblokowanych">
      {dane.map((d, i) => {
        const bx = gap + i * (bw + gap)
        const bh = h(d.v)
        const by = H - pad.b - bh
        return (
          <g key={d.label}>
            <rect
              className={'chart-bar' + (d.gold ? ' gold' : '')}
              x={bx}
              y={by}
              width={bw}
              height={bh}
              rx={5}
            >
              <title>{`${d.label} (${d.pod}): ${d.v}`}</title>
            </rect>
            <text className="chart-txt big-num" x={bx + bw / 2} y={by - 7} textAnchor="middle">
              {d.v}
            </text>
            <text className="chart-txt" x={bx + bw / 2} y={H - pad.b + 18} textAnchor="middle">
              {d.label}
            </text>
            <text
              className="chart-txt muted-txt"
              x={bx + bw / 2}
              y={H - pad.b + 32}
              textAnchor="middle"
            >
              {d.pod}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default async function StatystykiPage() {
  const [s, dash] = await Promise.all([getStatystyki(), getDashboard()])
  if (!s) {
    return (
      <section>
        <div className="note">
          <p>Brak danych. Wejdź w Kolekcję i kliknij „Synchronizuj ze Steam".</p>
        </div>
      </section>
    )
  }

  return (
    <section className="note paper-panel">
      <div className="tiles">
        <div className="tile">
          <span className="tile-num">
            {s.unlocked}/{s.total}
          </span>
          <span className="muted small">odblokowane</span>
        </div>
        <div className="tile">
          <span className="tile-num">{s.procent}%</span>
          <span className="muted small">ukończenia</span>
        </div>
        <div className="tile">
          <span className="tile-num">
            <Sprite name="coin" size={22} /> {s.rarest ? `${s.rarest.p}%` : '—'}
          </span>
          <span className="muted small">najrzadszy{s.rarest ? `: ${s.rarest.nazwa}` : ''}</span>
        </div>
        <div className="tile">
          <span className="tile-num">
            {s.latest ? new Date(s.latest.data).toLocaleDateString('pl-PL') : '—'}
          </span>
          <span className="muted small">ostatnio{s.latest ? `: ${s.latest.nazwa}` : ''}</span>
        </div>
      </div>

      <div className="note">
        <h2>Odblokowania w czasie</h2>
        <WykresCzas seria={s.seria} />
      </div>

      <div className="note">
        <h2>Rzadkość Twoich odblokowanych</h2>
        <div className="chart-legend">
          <span>
            <i className="lg-sw red" /> Częste / rzadkie
          </span>
          <span>
            <i className="lg-sw gold" /> Legendarne (&lt;5% graczy)
          </span>
        </div>
        <WykresRzadkosc b={s.buckets} />
      </div>

      <div className="note">
        <h2>Ukończenie postaci</h2>
        <div className="char-bars">
          {dash.postacie.map((c) => (
            <Link
              key={c.nazwa}
              href={`/profil/${encodeURIComponent(c.nazwa)}`}
              className="char-bar"
            >
              <img className="char-icon" src={ikonaPostaci(c.nazwa)} alt="" />
              <span className="char-name">{c.nazwa}</span>
              <div className="bar mini">
                <div className="bar-fill" style={{ width: `${c.procent}%` }} />
              </div>
              <span className="char-pct">{c.procent}%</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
