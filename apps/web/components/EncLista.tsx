'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EncDetal from '@/components/EncDetal'
import EncPowrot from '@/components/EncPowrot'
import ItemSprite from '@/components/ItemSprite'
import PustyStan from '@/components/PustyStan'
import { useT } from '@/components/JezykProvider'
import type { EncFiltr, EncWpis } from '@/lib/enc/typy'

type Props = {
  wpisy: EncWpis[]
  /** Chipy nad siatką; wpis pasuje, gdy ma id filtra w `grupy`. Puste = bez filtrów. */
  filtry?: EncFiltr[]
  /** Teksty przychodzą JUŻ przetłumaczone z serwerowych stron sekcji. Bez placeholdera
   *  wchodzi domyślne „Szukaj…". */
  placeholder?: string
  /** Podpowiedź nad szukajką. */
  wstep?: string
  /** Etykieta sortowania po `waga` (np. „Jakość", „Postęp”). Bez niej zostaje tylko A–Z. */
  sortWaga?: string
  /** Nazwa sekcji — pokazywana w pasku powrotu do rozdroża Encyklopedii. */
  sekcja?: string
}

type Sort = 'domyslna' | 'nazwa' | 'waga'

/**
 * Wspólna lista Encyklopedii: szukajka + filtry + sortowanie + siatka kart + modal.
 * Używana przez wszystkie sekcje — różnią się tylko danymi.
 */
export default function EncLista({
  wpisy,
  filtry = [],
  placeholder,
  wstep,
  sortWaga,
  sekcja,
}: Props) {
  const t = useT()
  // Placeholder domyślny liczymy tu, a nie w domyślnej wartości parametru — inaczej trzeba by
  // wołać hooka przed destrukturyzacją propsów.
  const szukajkaPlaceholder = placeholder ?? t('encyklopedia.szukajDomyslnie')
  const [q, setQ] = useState('')
  const [grupa, setGrupa] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('domyslna')
  const [sel, setSel] = useState<EncWpis | null>(null)
  const szukajka = useRef<HTMLInputElement>(null)

  // Portal wymaga DOM-u — na serwerze go nie ma.
  const [zamontowany, setZamontowany] = useState(false)
  useEffect(() => setZamontowany(true), [])

  // „/" ustawia kursor w szukajce (jak na wiki i w GitHubie), Escape zamyka modal.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null)
      const wPolu = document.activeElement?.tagName === 'INPUT'
      if (e.key === '/' && !wPolu && !sel) {
        e.preventDefault()
        szukajka.current?.focus()
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [sel])

  // Pod otwartym modalem strona nie może się scrollować.
  useEffect(() => {
    if (!sel) return
    const poprz = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = poprz
    }
  }, [sel])

  /** Szukamy w nazwie, opisie z karty i pełnym opisie — nie tylko w nazwie. */
  const pasuje = (w: EncWpis, szukane: string) =>
    w.nazwa.toLowerCase().includes(szukane) ||
    w.opis.toLowerCase().includes(szukane) ||
    (w.szczegoly?.pelnyOpis?.toLowerCase().includes(szukane) ?? false)

  // Liczniki przy chipach liczymy z samego wyszukiwania (bez aktywnego filtra),
  // żeby pokazywały, ile jest do wzięcia po przełączeniu.
  const poSzukaniu = useMemo(() => {
    const szukane = q.trim().toLowerCase()
    return szukane ? wpisy.filter((w) => pasuje(w, szukane)) : wpisy
  }, [wpisy, q])

  const widoczne = useMemo(() => {
    const lista = grupa ? poSzukaniu.filter((w) => w.grupy?.includes(grupa)) : poSzukaniu
    if (sort === 'nazwa') return [...lista].sort((a, b) => a.nazwa.localeCompare(b.nazwa))
    if (sort === 'waga') return [...lista].sort((a, b) => (b.waga ?? 0) - (a.waga ?? 0))
    return lista
  }, [poSzukaniu, grupa, sort])

  const licz = (id: string) => poSzukaniu.filter((w) => w.grupy?.includes(id)).length

  return (
    <section className="note paper-panel">
      <EncPowrot tytul={sekcja} />
      {wstep && <p className="muted small">{wstep}</p>}

      <div className="kol-tools">
        <span className="enc-szukajka">
          <input
            ref={szukajka}
            className="input grow"
            placeholder={szukajkaPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={szukajkaPlaceholder}
          />
          {q ? (
            <button
              className="enc-clear"
              onClick={() => setQ('')}
              aria-label={t('encyklopedia.wyczyscSzukajke')}
            >
              ✕
            </button>
          ) : (
            <kbd className="enc-kbd" aria-hidden>
              /
            </kbd>
          )}
        </span>

        {filtry.length > 0 && (
          <div className="filter-btns">
            <button
              className={'chip' + (grupa === null ? ' on' : '')}
              onClick={() => setGrupa(null)}
            >
              {t('encyklopedia.filtrWszystkie')}{' '}
              <span className="chip-licznik">{poSzukaniu.length}</span>
            </button>
            {filtry.map((f) => (
              <button
                key={f.id}
                className={'chip' + (grupa === f.id ? ' on' : '')}
                onClick={() => setGrupa(f.id)}
              >
                {f.label} <span className="chip-licznik">{licz(f.id)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="enc-pasek">
        <span className="muted small">
          {t('encyklopedia.licznikWidocznych', {
            widoczne: widoczne.length,
            wszystkie: wpisy.length,
          })}
        </span>
        <span className="filter-btns">
          <button
            className={'chip xs' + (sort === 'domyslna' ? ' on' : '')}
            onClick={() => setSort('domyslna')}
          >
            {t('encyklopedia.sortDomyslnie')}
          </button>
          <button
            className={'chip xs' + (sort === 'nazwa' ? ' on' : '')}
            onClick={() => setSort('nazwa')}
          >
            {t('encyklopedia.sortAlfabetycznie')}
          </button>
          {sortWaga && (
            <button
              className={'chip xs' + (sort === 'waga' ? ' on' : '')}
              onClick={() => setSort('waga')}
            >
              {sortWaga}
            </button>
          )}
        </span>
      </div>

      {widoczne.length === 0 ? (
        <PustyStan
          tekst={
            <>
              <b>{t('encyklopedia.brakWynikow', { q })}</b> {t('encyklopedia.brakWynikowRada')}
            </>
          }
        />
      ) : (
        <div className="item-grid">
          {widoczne.map((w) => (
            <button
              key={w.id}
              className={'item-card' + (w.klasa ? ' ' + w.klasa : '')}
              onClick={() => setSel(w)}
            >
              {w.odznaka && <span className="q-badge">{w.odznaka}</span>}
              <Ikona wpis={w} size={32} />
              <span className="item-txt">
                <span className="item-name">{w.nazwa}</span>
                {w.opis && <span className="item-desc">{w.opis}</span>}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Modal idzie PORTALEM do <body>: .container i pasek tytułu to rodzeństwo w osobnych
          kontekstach układania, więc siedząc w .container modal chowałby się pod topbarem
          (i dymkiem companiona) bez względu na z-index. */}
      {sel &&
        zamontowany &&
        createPortal(
          <div className="modal-bg" onClick={() => setSel(null)}>
            <EncDetal wpis={sel} onZamknij={() => setSel(null)} />
          </div>,
          document.body,
        )}
    </section>
  )
}

/** Ikona wpisu: gotowa ścieżka (portret) albo sprite itemu dobrany po idW/nazwie. */
function Ikona({ wpis, size }: { wpis: EncWpis; size: number }) {
  if (wpis.ikona) {
    return (
      <img
        src={wpis.ikona}
        alt=""
        width={size}
        height={size}
        // Lista bossów to ~130 portretów naraz — pobieramy je dopiero przy dojeżdżaniu.
        loading="lazy"
        decoding="async"
        className="sprite item-sprite"
        aria-hidden
        draggable={false}
      />
    )
  }
  return <ItemSprite nazwa={wpis.nazwa} idW={wpis.idW} typ={wpis.typ} size={size} />
}
