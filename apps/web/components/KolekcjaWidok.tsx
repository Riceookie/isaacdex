'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sprite from '@/components/Sprite'
import PustyStan from '@/components/PustyStan'
import ZalogujStan from '@/components/ZalogujStan'
import { powiedz } from '@/lib/companionGlos'
import { kwestiaPostepu, wielkiAchievement } from '@/lib/companions'
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

/**
 * Wielkie achievementy (Dead God, Platinum God…) maskotka celebruje RAZ w życiu, nie przy
 * każdym wejściu w Kolekcję — inaczej „moment" zamieniłby się w powiadomienie. Lista już
 * odegranych siedzi w localStorage, bo to preferencja prezentacji, a nie dane gracza:
 * czyszczenie przeglądarki co najwyżej da komuś drugą fetę z Dead Goda.
 */
const KLUCZ_SWIETOWANE = 'idx_companion_swietowane'

function odczytajSwietowane(): Set<string> {
  try {
    const raw = localStorage.getItem(KLUCZ_SWIETOWANE)
    const lista: unknown = raw ? JSON.parse(raw) : []
    return new Set(
      Array.isArray(lista) ? lista.filter((x): x is string => typeof x === 'string') : [],
    )
  } catch {
    // Uszkodzony/zajęty localStorage nie ma prawa wywalić widoku Kolekcji — w najgorszym
    // razie maskotka pogratuluje drugi raz.
    return new Set()
  }
}

function zapiszSwietowane(zbior: Set<string>) {
  try {
    localStorage.setItem(KLUCZ_SWIETOWANE, JSON.stringify([...zbior]))
  } catch {
    // Prywatne okno / brak miejsca — trudno, celebracja po prostu się powtórzy.
  }
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

  const procent = achievements.length ? Math.round((unlocked / achievements.length) * 100) : 0

  /**
   * Reakcja maskotki na WEJŚCIE w Kolekcję — jedna kwestia, w kolejności ważności:
   * wielki achievement (jeśli jest świeży) > postęp procentowy > pusty stan.
   *
   * Kolejność jest istotna, bo `powiedz` nadpisuje poprzednią kwestię: dwa wywołania pod rząd
   * dałyby tylko to drugie i Dead God przepadłby pod komentarzem o procentach. Dlatego jeden
   * efekt wybiera jedną kwestię, zamiast kilku efektów strzelających równolegle.
   */
  const juzOdezwalSie = useRef(false)
  // Po synchronizacji efekt puszczamy jeszcze raz, ale WYŁĄCZNIE po to, by wyłapać świeży
  // wielki achievement. Bez tego komentarz o postępie nadpisałby dopiero co powiedziane
  // „N nowych achievementów" — `router.refresh()` wraca z nowymi danymi ułamek sekundy później.
  const tylkoWielki = useRef(false)
  useEffect(() => {
    // Gość ogląda cudzy katalog (0/0) — komentowanie „jego" postępu nie miałoby sensu.
    if (gosc || juzOdezwalSie.current) return
    juzOdezwalSie.current = true
    const poSync = tylkoWielki.current
    tylkoWielki.current = false

    if (achievements.length === 0) {
      if (poSync) return
      powiedz(t('companion.pustoKolekcja'), 'thinking')
      return
    }

    // WIELKI MOMENT — Dead God / Platinum God / 1000000% / Real Platinum God.
    const swietowane = odczytajSwietowane()
    const swiezy = achievements.find(
      (a) => a.odblokowany && wielkiAchievement(a.nazwa) && !swietowane.has(a.nazwa),
    )
    if (swiezy) {
      const klucz = wielkiAchievement(swiezy.nazwa)!
      swietowane.add(swiezy.nazwa)
      zapiszSwietowane(swietowane)
      powiedz(t(klucz), 'excited')
      return
    }

    if (poSync) return
    powiedz(t(kwestiaPostepu(procent), { procent }), procent >= 75 ? 'excited' : 'zwykly')
  }, [achievements, gosc, procent, t])

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
      // Ile faktycznie doszło od ostatniego razu — serwer oddaje nowy licznik, my mamy stary.
      // Konkretna liczba jest ciekawsza niż generyczne „zsynchronizowano", a zero też jest
      // informacją (i okazją do docinki).
      const nowe = typeof d.unlocked === 'number' ? d.unlocked - unlocked : 0
      if (nowe > 0) powiedz(t('companion.syncNowe', { liczba: nowe }), 'excited')
      else powiedz(t('companion.syncBezZmian'), 'zwykly')
      // Świeże dane mogą przynieść wielki achievement — pozwól efektowi odezwać się jeszcze raz,
      // ale tylko w tej jednej sprawie (patrz `tylkoWielki`).
      juzOdezwalSie.current = false
      tylkoWielki.current = true
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
