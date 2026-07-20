'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sprite from '@/components/Sprite'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'
import { powiedz } from '@/lib/companionGlos'
import EncDetal from '@/components/EncDetal'
import { useJezyk, useT } from '@/components/JezykProvider'
import type { Tlumacz } from '@/lib/i18n/slownik'
import type { Jezyk } from '@/lib/i18n/jezyk'
import warunki from '@/lib/enc/achievementy.json'
import type { EncWpis } from '@/lib/enc/typy'

const WARUNKI = warunki as Record<string, string>

/** Daty formatujemy w locale interfejsu — inaczej „12/03" znaczyłoby co innego w każdym języku. */
const locale = (j: Jezyk) => (j === 'pl' ? 'pl-PL' : 'en-US')

/**
 * Achievement → wpis Encyklopedii, żeby modal był ten sam co przy itemach.
 *
 * Nazwa i opis achievementu lecą prosto ze Steama — zostają po angielsku w obu językach,
 * tak samo jak reszta nazw własnych z gry. Tłumaczą się tylko etykiety wokół nich.
 */
function naWpis(a: Ach, t: Tlumacz, jezyk: Jezyk): EncWpis {
  const warunek = WARUNKI[a.nazwa]
  const jakZdobyc = t('kolekcja.jakZdobyc')
  return {
    id: a.apiName,
    nazwa: a.nazwa,
    ikona: a.ikonaUrl ?? undefined,
    klasa: a.odblokowany ? 'ach-detal' : 'ach-detal zablokowany',
    opis: a.opis ?? '',
    szczegoly: {
      znaczniki: [
        a.odblokowany ? t('kolekcja.znacznikOdblokowane') : t('kolekcja.znacznikZablokowane'),
        ...(rzadka(a.globalnyProcent) ? [t('kolekcja.znacznikRzadkie')] : []),
      ],
      pola: [
        ...(a.globalnyProcent != null
          ? [
              {
                label: t('kolekcja.maJeGlobalnie'),
                wartosc: t('kolekcja.procentGraczy', { procent: a.globalnyProcent }),
              },
            ]
          : []),
        ...(a.dataOdblokowania
          ? [
              {
                label: t('kolekcja.zdobyte'),
                wartosc: new Date(a.dataOdblokowania).toLocaleDateString(locale(jezyk)),
              },
            ]
          : []),
      ],
      pelnyOpis: a.opis ?? undefined,
      // Warunek zdobycia bierzemy z wiki (Steam podaje go tylko dla części achievementów).
      odblokowanie: warunek
        ? { nazwa: jakZdobyc, warunek, zdobyte: a.odblokowany }
        : {
            nazwa: jakZdobyc,
            warunek: t('kolekcja.brakOpisuNaWiki'),
            zdobyte: a.odblokowany,
          },
    },
  }
}

type Ach = {
  apiName: string
  nazwa: string
  opis: string | null
  ikonaUrl: string | null
  globalnyProcent: number | null
  odblokowany: boolean
  dataOdblokowania: string | null
}

function rzadka(p: number | null) {
  return p != null && p < 5
}

export default function KolekcjaWidok({
  achievements,
  ostatniSync,
  gosc = false,
}: {
  achievements: Ach[]
  ostatniSync: string | null
  /** Gość nie ma achievementów (0/0) i nie synchronizuje — najpierw musi się zalogować. */
  gosc?: boolean
}) {
  const router = useRouter()
  const t = useT()
  const jezyk = useJezyk()
  const [sel, setSel] = useState<Ach | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filtr, setFiltr] = useState<'all' | 'unlocked' | 'locked' | 'rare'>('all')

  const unlocked = achievements.filter((a) => a.odblokowany).length
  const filtrowane = achievements.filter((a) => {
    if (q && !a.nazwa.toLowerCase().includes(q.toLowerCase())) return false
    if (filtr === 'unlocked') return a.odblokowany
    if (filtr === 'locked') return !a.odblokowany
    if (filtr === 'rare') return a.globalnyProcent != null && a.globalnyProcent < 5
    return true
  })

  async function sync() {
    setBusy(true)
    setMsg(null)
    try {
      const r = await fetch('/api/sync', { method: 'POST' })
      const d = await r.json()
      if (!r.ok) {
        setMsg(d.error || t('kolekcja.bladSync'))
        return
      }
      // „Unlock" w praktyce: świeżo zassane achievementy — maskotka to celebruje.
      powiedz(t('kolekcja.glosSync'), 'excited')
      router.refresh()
    } catch {
      setMsg(t('kolekcja.bladSieci'))
    } finally {
      setBusy(false)
    }
  }

  // Krótka reakcja maskotki na obejrzenie achievementu (klik = otwarcie modalu).
  function reaguj(a: Ach) {
    const rzadki = rzadka(a.globalnyProcent)
    if (a.odblokowany) powiedz(t(rzadki ? 'kolekcja.glosRzadkieMam' : 'kolekcja.glosMam'), 'happy')
    else if (gosc) powiedz(t('kolekcja.glosGosc'), 'sad')
    else powiedz(t(rzadki ? 'kolekcja.glosRzadkieBrak' : 'kolekcja.glosBrak'), 'zwykly')
  }

  return (
    <section className="note paper-panel">
      <div className="kol-head">
        {gosc ? (
          <Link className="btn" href="/logowanie">
            <Sprite name="isaacHead" size={18} /> {t('kolekcja.zalogujBySteam')}
          </Link>
        ) : (
          <button className="btn" onClick={sync} disabled={busy}>
            <Sprite name="gear" size={18} />{' '}
            {busy ? t('kolekcja.synchronizuje') : t('kolekcja.synchronizuj')}
          </button>
        )}
        <span className="sync-info muted small">
          {gosc
            ? t('kolekcja.podgladKatalogu')
            : busy
              ? t('kolekcja.zaciagam')
              : ostatniSync
                ? t('kolekcja.ostatniaSync', {
                    kiedy: new Date(ostatniSync).toLocaleString(locale(jezyk), {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  })
                : t('kolekcja.brakSync')}
        </span>
      </div>

      {achievements.length > 0 ? (
        <>
          {/* Licznik z pogrubioną liczbą siedzi w jednym kluczu — w obu językach stoi ona
              w innym miejscu zdania, więc sklejanie go w JSX rozjechałoby szyk. */}
          <p
            className="muted"
            dangerouslySetInnerHTML={{
              __html:
                t('kolekcja.odblokowaneZ', { liczba: unlocked, wszystkie: achievements.length }) +
                (q || filtr !== 'all'
                  ? ` · ${t('kolekcja.pokazujeWyniki', { liczba: filtrowane.length })}`
                  : ''),
            }}
          />
          <div className="kol-tools">
            <input
              className="input grow"
              placeholder={t('kolekcja.szukajAchievementu')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="filter-btns">
              {(
                [
                  ['all', 'kolekcja.filtrWszystkie'],
                  ['unlocked', 'kolekcja.filtrOdblokowane'],
                  ['locked', 'kolekcja.filtrZablokowane'],
                  ['rare', 'kolekcja.filtrRzadkie'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  className={'chip' + (filtr === k ? ' on' : '')}
                  onClick={() => setFiltr(k)}
                >
                  {t(label)}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : gosc ? (
        <div className="note">
          {/* Teksty pustych stanów mają w środku pogrubienia i link, więc idą jako jeden
              klucz z HTML-em — inaczej każde zdanie trzeba by ciąć na kawałki i składać. */}
          <ZalogujStan
            tekst={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.goscTekst') }} />}
            poza={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.goscPoza') }} />}
          />
        </div>
      ) : (
        <div className="note">
          <PustyStan
            tekst={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.pustoTekst') }} />}
            akcja={
              <button className="btn" onClick={sync} disabled={busy}>
                <Sprite name="trophy" size={18} />{' '}
                {busy ? t('kolekcja.sciagam') : t('kolekcja.synchronizuj')}
              </button>
            }
            poza={<span dangerouslySetInnerHTML={{ __html: t('kolekcja.pustoPoza') }} />}
          />
        </div>
      )}
      {msg && (
        <p className="banner error">
          <Sprite name="bomb" size={18} /> {msg}
        </p>
      )}

      <div className="ach-grid">
        {filtrowane.map((a) => (
          <button
            key={a.apiName}
            className={
              'ach ' + (a.odblokowany ? 'on' : 'off') + (rzadka(a.globalnyProcent) ? ' rare' : '')
            }
            onClick={() => {
              setSel(a)
              reaguj(a)
            }}
            data-tip={a.nazwa}
          >
            {a.ikonaUrl ? <img src={a.ikonaUrl} alt={a.nazwa} loading="lazy" /> : <span>?</span>}
          </button>
        ))}
      </div>

      {sel &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="modal-bg" onClick={() => setSel(null)}>
            <EncDetal wpis={naWpis(sel, t, jezyk)} onZamknij={() => setSel(null)} />
          </div>,
          document.body,
        )}
    </section>
  )
}
