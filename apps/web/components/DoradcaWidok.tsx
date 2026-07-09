'use client'

import { useEffect, useState } from 'react'
import ItemSprite from '@/components/ItemSprite'
import { companionZId, DOMYSLNY_COMPANION, type Companion } from '@/lib/companions'

type Item = {
  idW: number | null
  nazwa: string
  jakosc: number
  typ: string
  rekomendacja: string
  powody: string[]
}

export default function DoradcaWidok({ items }: { items: Item[] }) {
  const [q, setQ] = useState('')
  const [jak, setJak] = useState<number | null>(null)
  const [sel, setSel] = useState<Item | null>(null)
  // Doradcą jest wybrany companion (jak w Ustawieniach).
  const [comp, setComp] = useState<Companion>(DOMYSLNY_COMPANION)
  useEffect(() => {
    setComp(companionZId(localStorage.getItem('idx_companion')))
    const on = () => setComp(companionZId(localStorage.getItem('idx_companion')))
    window.addEventListener('idx-companion', on)
    return () => window.removeEventListener('idx-companion', on)
  }, [])

  const filt = items.filter(
    (i) =>
      (!q || i.nazwa.toLowerCase().includes(q.toLowerCase())) && (jak === null || i.jakosc === jak),
  )

  return (
    <section className="note paper-panel">
      <p className="muted small">Kliknij item, żeby zobaczyć rekomendację „brać czy zostawić".</p>

      <div className="kol-tools">
        <input
          className="input grow"
          placeholder="Szukaj itemu…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="filter-btns">
          <button className={'chip' + (jak === null ? ' on' : '')} onClick={() => setJak(null)}>
            Wszystkie
          </button>
          {[4, 3, 2, 1, 0].map((n) => (
            <button key={n} className={'chip' + (jak === n ? ' on' : '')} onClick={() => setJak(n)}>
              Q{n}
            </button>
          ))}
        </div>
      </div>

      <div className="item-grid">
        {filt.map((i) => (
          <button key={i.nazwa} className={'item-card q' + i.jakosc} onClick={() => setSel(i)}>
            <span className="q-badge">Q{i.jakosc}</span>
            <ItemSprite nazwa={i.nazwa} idW={i.idW} typ={i.typ} size={32} />
            <span className="item-name">{i.nazwa}</span>
          </button>
        ))}
      </div>

      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal paper advisor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adv-item">
              <ItemSprite nazwa={sel.nazwa} idW={sel.idW} typ={sel.typ} size={44} />
              <div>
                <h2>{sel.nazwa}</h2>
                <p className="muted small">
                  Jakość {sel.jakosc} · {sel.typ.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="adv-talk">
              <div className="adv-soul" aria-hidden="true">
                <img src={`/tboi/${comp.file}`} alt="" width={68} height={68} className="sprite" />
              </div>
              <div className="speech-bubble">
                <p className={'rek-tag ' + sel.rekomendacja}>
                  {sel.rekomendacja.replace(/_/g, ' ')}
                </p>
                <ul className="rek-powody">
                  {sel.powody.map((pw, idx) => (
                    <li key={idx}>{pw}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="btn full" onClick={() => setSel(null)}>
              Zamknij
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
