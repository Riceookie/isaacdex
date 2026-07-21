'use client'

import { useMemo, useState } from 'react'
import { policzStaty, type Stat } from '@isaacdex/core'
import ItemSprite from '@/components/ItemSprite'
import { useT } from '@/components/JezykProvider'
import { powiedz } from '@/lib/companionGlos'
import { ikonaPostaci } from '@/lib/chars'
import {
  ITEMY_STATY,
  opisModyfikatora,
  POSTACIE_STATY,
  SKALA,
  STATY_OPIS,
  type ItemStaty,
} from '@/lib/enc/statyDane'

/**
 * Kalkulator statystyk: wybierasz postać, dorzucasz itemy, a tabela na żywo pokazuje,
 * jak zmieniają się staty. Liczy `policzStaty` z @isaacdex/core (płaskie dodatki → mnożniki
 * → limity gry), więc ta sama logika jest testowana w pakiecie core.
 */
type Grupa = 'bazowe' | 'tainted'

export default function KalkulatorWidok() {
  const t = useT()
  const [postac, setPostac] = useState(POSTACIE_STATY[0])
  const [grupa, setGrupa] = useState<Grupa>('bazowe')
  const [wybrane, setWybrane] = useState<ItemStaty[]>([])
  const [q, setQ] = useState('')

  const postacie = useMemo(
    () => POSTACIE_STATY.filter((p) => (grupa === 'tainted' ? p.tainted : !p.tainted)),
    [grupa],
  )

  const baza = useMemo(() => policzStaty(postac, []), [postac])
  const suma = useMemo(() => policzStaty(postac, wybrane), [postac, wybrane])

  const znalezione = useMemo(() => {
    // Pokazujemy WSZYSTKIE itemy (kiedyś ucinane do 24 bez wyszukiwania — przez co kalkulator
    // wyglądał, jakby znał tylko garść przedmiotów). Katalog ma ~160 pozycji, siatka sama się
    // przewija, więc nie ma po co niczego ucinać; wyszukiwarka tylko zawęża listę.
    const szukane = q.trim().toLowerCase()
    return ITEMY_STATY.filter((i) => !szukane || i.nazwa.toLowerCase().includes(szukane))
  }, [q])

  // Maskotka komentuje budowanie buildu — reaguje na dodany item (mina „myślę/ekscytacja").
  const dodaj = (i: ItemStaty) => {
    if (wybrane.length + 1 >= 6) powiedz(t('kolekcja.kalkGlosDuzyBuild'), 'excited')
    else powiedz(t('kolekcja.kalkGlosDodano', { item: i.nazwa }), 'thinking')
    setWybrane((w) => [...w, i])
  }
  const usun = (idx: number) => setWybrane((w) => w.filter((_, j) => j !== idx))

  return (
    <section className="note paper-panel kalk">
      <div className="paper-head">
        <h2>{t('kolekcja.kalkTytul')}</h2>
        {wybrane.length > 0 && (
          <button className="chip" onClick={() => setWybrane([])}>
            {t('kolekcja.kalkWyczysc', { ile: wybrane.length })}
          </button>
        )}
      </div>

      {/* ── Postać ── */}
      <h3 className="kalk-naglowek">{t('kolekcja.kalkPostac')}</h3>
      <div className="filter-btns kalk-grupy">
        <button
          className={'chip' + (grupa === 'bazowe' ? ' on' : '')}
          onClick={() => setGrupa('bazowe')}
        >
          {t('kolekcja.kalkBazowe')}{' '}
          <span className="chip-licznik">{POSTACIE_STATY.filter((p) => !p.tainted).length}</span>
        </button>
        <button
          className={'chip' + (grupa === 'tainted' ? ' on' : '')}
          onClick={() => setGrupa('tainted')}
        >
          {t('kolekcja.kalkSplugawione')}{' '}
          <span className="chip-licznik">{POSTACIE_STATY.filter((p) => p.tainted).length}</span>
        </button>
      </div>
      <div className="kalk-postacie">
        {postacie.map((p) => (
          <button
            key={p.nazwa}
            className={'kalk-postac' + (p.nazwa === postac.nazwa ? ' on' : '')}
            onClick={() => setPostac(p)}
            aria-pressed={p.nazwa === postac.nazwa}
          >
            <img src={ikonaPostaci(p.ikona)} alt="" width={34} height={34} aria-hidden />
            <span>{p.nazwa}</span>
          </button>
        ))}
      </div>
      <p className="muted small">{t('kolekcja.kalkFormyPrzypis')}</p>

      {/* ── Tabela statów ── */}
      <h3 className="kalk-naglowek">{t('kolekcja.kalkStatystyki')}</h3>
      <div className="kalk-tabela">
        <div className="kalk-wiersz kalk-glowka">
          <span>{t('kolekcja.kalkKolStat')}</span>
          <span>{t('kolekcja.kalkKolBaza')}</span>
          <span>{t('kolekcja.kalkKolPoItemach')}</span>
        </div>
        {/* Nazwy i opisy statów mieszkają w przestrzeni „encyklopedia" — kalkulator tylko je czyta. */}
        {STATY_OPIS.map(({ stat, labelKlucz, opisKlucz }) => (
          <Wiersz
            key={stat}
            stat={stat}
            label={t(labelKlucz)}
            opis={t(opisKlucz)}
            baza={baza[stat]}
            teraz={suma[stat]}
          />
        ))}
      </div>

      {/* ── Wybrane itemy ── */}
      <h3 className="kalk-naglowek">
        {t('kolekcja.kalkTwojeItemy')} {wybrane.length > 0 && `(${wybrane.length})`}
      </h3>
      {wybrane.length === 0 ? (
        <p className="muted small">{t('kolekcja.kalkNicNieWziete')}</p>
      ) : (
        <div className="kalk-wybrane">
          {wybrane.map((i, idx) => (
            <button key={`${i.id}-${idx}`} className="kalk-wybrany" onClick={() => usun(idx)}>
              <ItemSprite nazwa={i.nazwa} idW={i.id} size={26} />
              <span>{i.nazwa}</span>
              <span className="kalk-x" aria-hidden>
                ✕
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Dodawanie itemów ── */}
      <h3 className="kalk-naglowek">{t('kolekcja.kalkDodajItem')}</h3>
      <div className="kol-tools">
        <input
          className="input grow"
          placeholder={t('kolekcja.kalkSzukajPlaceholder')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t('kolekcja.kalkSzukajAria')}
        />
      </div>
      <p className="muted small">{t('kolekcja.kalkIleItemow', { liczba: ITEMY_STATY.length })}</p>
      <div className="item-grid">
        {znalezione.map((i) => (
          <button
            key={i.id}
            // Ta sama skala jakości co w Encyklopedii — kolor odznaki i krechy niesie `qN`.
            className={'item-card' + (i.jakosc != null ? ' q' + i.jakosc : '')}
            onClick={() => dodaj(i)}
          >
            <ItemSprite nazwa={i.nazwa} idW={i.id} size={32} />
            <span className="item-txt">
              <span className="item-name">{i.nazwa}</span>
              <span className="item-desc">{opisModyfikatora(i, t)}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

/** Wiersz tabeli: nazwa, baza, wartość po itemach + pasek i delta. */
function Wiersz({
  stat,
  label,
  opis,
  baza,
  teraz,
}: {
  stat: Stat
  label: string
  opis: string
  baza: number
  teraz: number
}) {
  const delta = Math.round((teraz - baza) * 100) / 100
  const procent = Math.min(100, (teraz / SKALA[stat]) * 100)

  return (
    <div className="kalk-wiersz" title={opis}>
      <span className="kalk-nazwa">
        {/* Oficjalna ikona statu z HUD-u gry (resources/gfx/ui/hudstats.png). */}
        <img className="kalk-ikona" src={`/tboi/staty/${stat}.png`} alt="" width={18} height={18} />
        {label}
      </span>
      <span className="kalk-baza">{baza}</span>
      <span className="kalk-teraz">
        <strong>{teraz}</strong>
        {delta !== 0 && (
          <em className={delta > 0 ? 'w-gore' : 'w-dol'}>
            {delta > 0 ? '+' : ''}
            {delta}
          </em>
        )}
        <span className="kalk-pasek" aria-hidden>
          <span style={{ width: `${procent}%` }} />
        </span>
      </span>
    </div>
  )
}
