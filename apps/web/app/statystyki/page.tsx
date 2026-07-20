import Link from 'next/link'
import { getStatystyki, getDashboard } from '@/lib/queries'
import { czyZalogowany } from '@/lib/konto'
import { ikonaPostaci, jestTainted } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import PustyStan from '@/components/PustyStan'
import { jezykSerwera, tlumacz } from '@/lib/i18n/serwer'
import type { Tlumacz } from '@/lib/i18n/slownik'

export const dynamic = 'force-dynamic'

/** Zerowa statystyka dla gościa — layout ten sam, tylko wszystkie liczby na zero. */
const STATY_ZERO = {
  total: 0,
  unlocked: 0,
  procent: 0,
  buckets: { legendarne: 0, rzadkie: 0, czeste: 0 },
  rarest: null,
  seria: [] as { m: string; cum: number }[],
  latest: null,
}

// ── Wykres: skumulowane odblokowania w czasie (jedna seria → kolor akcentu) ──
function WykresCzas({ seria, t }: { seria: { m: string; cum: number }[]; t: Tlumacz }) {
  if (seria.length < 2) {
    return <p className="muted small">{t('kolekcja.wykresZaMaloDanych')}</p>
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
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="chart"
      role="img"
      aria-label={t('kolekcja.statyWCzasie')}
    >
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
          <title>{t('kolekcja.wykresPunkt', { miesiac: p.m, liczba: p.cum })}</title>
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
function WykresRzadkosc({
  b,
  t,
}: {
  b: { legendarne: number; rzadkie: number; czeste: number }
  t: Tlumacz
}) {
  const dane = [
    { label: t('kolekcja.kubelekCzeste'), pod: '>20%', v: b.czeste, gold: false },
    { label: t('kolekcja.kubelekRzadkie'), pod: '5–20%', v: b.rzadkie, gold: false },
    { label: t('kolekcja.kubelekLegendarne'), pod: '<5%', v: b.legendarne, gold: true },
  ]
  const W = 680
  const H = 210
  const pad = { t: 24, b: 40 }
  const max = Math.max(1, ...dane.map((d) => d.v))
  const bw = 120
  const gap = (W - dane.length * bw) / (dane.length + 1)
  const h = (v: number) => (v / max) * (H - pad.t - pad.b)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="chart"
      role="img"
      aria-label={t('kolekcja.statyRzadkosc')}
    >
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
  const [zalogowany, s, dash] = await Promise.all([
    czyZalogowany(),
    getStatystyki(),
    getDashboard(),
  ])
  const t = tlumacz()
  const jezyk = jezykSerwera()

  // Gość widzi ten sam ekran, ale wyzerowany — plus baner, po co się logować.
  const gosc = !zalogowany
  if (!s && !gosc) {
    return (
      <section>
        <div className="note">
          {/* Zdania z pogrubieniem i linkiem idą jednym kluczem — po pocięciu na kawałki
              szyk drugiego języka i tak by się rozjechał. */}
          <PustyStan
            tekst={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.statyPustoTekst') }} />}
            akcja={
              <Link className="btn" href="/kim-jestem">
                <Sprite name="trophy" size={18} /> {t('kolekcja.statyPodlaczSteam')}
              </Link>
            }
            poza={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.statyPustoPoza') }} />}
          />
        </div>
      </section>
    )
  }
  const dane = s ?? STATY_ZERO

  return (
    <section className="note paper-panel">
      {gosc && (
        <p className="banner demo" role="status">
          <Sprite name="deadgod" size={16} /> {t('kolekcja.statyBanerGosc')}{' '}
          <Link href="/logowanie" className="banner-link">
            {t('kolekcja.statyBanerLink')}
          </Link>
        </p>
      )}
      <div className="tiles">
        <div className="tile">
          <span className="tile-num">
            {dane.unlocked}/{dane.total}
          </span>
          <span className="muted small">{t('kolekcja.statyOdblokowane')}</span>
        </div>
        <div className="tile">
          <span className="tile-num">{dane.procent}%</span>
          <span className="muted small">{t('kolekcja.statyUkonczenia')}</span>
        </div>
        <div className="tile">
          <span className="tile-num">
            <Sprite name="coin" size={22} /> {dane.rarest ? `${dane.rarest.p}%` : '—'}
          </span>
          {/* Nazwa achievementu zostaje po angielsku — tłumaczy się tylko podpis kafelka. */}
          <span className="muted small">
            {dane.rarest
              ? t('kolekcja.statyNajrzadszyZ', { nazwa: dane.rarest.nazwa })
              : t('kolekcja.statyNajrzadszy')}
          </span>
        </div>
        <div className="tile">
          <span className="tile-num">
            {dane.latest
              ? new Date(dane.latest.data).toLocaleDateString(jezyk === 'pl' ? 'pl-PL' : 'en-US')
              : '—'}
          </span>
          <span className="muted small">
            {dane.latest
              ? t('kolekcja.statyOstatnioZ', { nazwa: dane.latest.nazwa })
              : t('kolekcja.statyOstatnio')}
          </span>
        </div>
      </div>

      <div className="note">
        <h2>{t('kolekcja.statyWCzasie')}</h2>
        <WykresCzas seria={dane.seria} t={t} />
      </div>

      <div className="note">
        <h2>{t('kolekcja.statyRzadkosc')}</h2>
        <div className="chart-legend">
          <span>
            <i className="lg-sw red" /> {t('kolekcja.legendaCzesteRzadkie')}
          </span>
          <span>
            <i className="lg-sw gold" /> {t('kolekcja.legendaLegendarne')}
          </span>
        </div>
        <WykresRzadkosc b={dane.buckets} t={t} />
      </div>

      <div className="note">
        <h2>{t('kolekcja.statyUkonczeniePostaci')}</h2>
        <div className="char-bars">
          {dash.postacie.map((c) => {
            // Postacie splugawione (Tainted) nie mają completion marks jako achievementów
            // Steam — Web API nie zwraca ich odblokowań, więc zamiast mylącego „0%"
            // pokazujemy jawnie „bez danych Steam" (patrz przypis pod listą).
            const bezDanych = jestTainted(c.nazwa) && c.zaliczone === 0
            return (
              <Link
                key={c.nazwa}
                href={`/profil/${encodeURIComponent(c.nazwa)}`}
                className={`char-bar${bezDanych ? ' char-bar--nodata' : ''}`}
              >
                <img className="char-icon" src={ikonaPostaci(c.nazwa)} alt="" />
                <span className="char-name">{c.nazwa}</span>
                {bezDanych ? (
                  <span className="char-nodata" title={t('kolekcja.bezDanychTytul')}>
                    {t('kolekcja.bezDanychSteam')}
                  </span>
                ) : (
                  <>
                    <div className="bar mini">
                      <div className="bar-fill" style={{ width: `${c.procent}%` }} />
                    </div>
                    <span className="char-pct">{c.procent}%</span>
                  </>
                )}
              </Link>
            )
          })}
        </div>
        <p className="small muted char-nodata-note">
          <Sprite name="godhead" size={14} />
          <span dangerouslySetInnerHTML={{ __html: t('kolekcja.bezDanychPrzypis') }} />
        </p>
      </div>
    </section>
  )
}
