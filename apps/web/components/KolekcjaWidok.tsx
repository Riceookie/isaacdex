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
import warunki from '@/lib/enc/achievementy.json'
import type { EncWpis } from '@/lib/enc/typy'

const WARUNKI = warunki as Record<string, string>

/** Achievement → wpis Encyklopedii, żeby modal był ten sam co przy itemach. */
function naWpis(a: Ach): EncWpis {
  const warunek = WARUNKI[a.nazwa]
  return {
    id: a.apiName,
    nazwa: a.nazwa,
    ikona: a.ikonaUrl ?? undefined,
    klasa: a.odblokowany ? 'ach-detal' : 'ach-detal zablokowany',
    opis: a.opis ?? '',
    szczegoly: {
      znaczniki: [
        a.odblokowany ? 'odblokowane' : 'zablokowane',
        ...(rzadka(a.globalnyProcent) ? ['rzadkie'] : []),
      ],
      pola: [
        ...(a.globalnyProcent != null
          ? [{ label: 'Ma je globalnie', wartosc: `${a.globalnyProcent}% graczy` }]
          : []),
        ...(a.dataOdblokowania
          ? [
              {
                label: 'Zdobyte',
                wartosc: new Date(a.dataOdblokowania).toLocaleDateString('pl-PL'),
              },
            ]
          : []),
      ],
      pelnyOpis: a.opis ?? undefined,
      // Warunek zdobycia bierzemy z wiki (Steam podaje go tylko dla części achievementów).
      odblokowanie: warunek
        ? { nazwa: 'Jak zdobyć', warunek, zdobyte: a.odblokowany }
        : { nazwa: 'Jak zdobyć', warunek: 'Brak opisu na wiki.', zdobyte: a.odblokowany },
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
        setMsg(d.error || 'Nie udało się zsynchronizować.')
        return
      }
      // „Unlock" w praktyce: świeżo zassane achievementy — maskotka to celebruje.
      powiedz('Świeże achievementy zassane. Widziałem każdy.', 'excited')
      router.refresh()
    } catch {
      setMsg('Błąd sieci przy synchronizacji.')
    } finally {
      setBusy(false)
    }
  }

  // Krótka reakcja maskotki na obejrzenie achievementu (klik = otwarcie modalu).
  function reaguj(a: Ach) {
    const rzadki = rzadka(a.globalnyProcent)
    if (a.odblokowany) powiedz(rzadki ? 'Rzadkie! Szanuję.' : 'Masz to. Ładnie.', 'happy')
    else if (gosc) powiedz('Zaloguj się i zdobądź je naprawdę.', 'sad')
    else powiedz(rzadki ? 'To rzadkie. Warte grindu.' : 'Jeszcze zablokowane. Do dzieła.', 'zwykly')
  }

  return (
    <section className="note paper-panel">
      <div className="kol-head">
        {gosc ? (
          <Link className="btn" href="/logowanie">
            <Sprite name="isaacHead" size={18} /> Zaloguj się, aby podłączyć Steam
          </Link>
        ) : (
          <button className="btn" onClick={sync} disabled={busy}>
            <Sprite name="gear" size={18} /> {busy ? 'Synchronizuję…' : 'Synchronizuj ze Steam'}
          </button>
        )}
        <span className="sync-info muted small">
          {gosc
            ? 'Podgląd katalogu — zaloguj się, aby zobaczyć swoje odblokowania.'
            : busy
              ? 'Zaciągam achievementy ze Steama…'
              : ostatniSync
                ? `Ostatnia synchronizacja: ${new Date(ostatniSync).toLocaleString('pl-PL', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}`
                : 'Jeszcze nie synchronizowano'}
        </span>
      </div>

      {achievements.length > 0 ? (
        <>
          <p className="muted">
            Odblokowane <b>{unlocked}</b> / {achievements.length}
            {(q || filtr !== 'all') && ` · pokazuję ${filtrowane.length}`}
          </p>
          <div className="kol-tools">
            <input
              className="input grow"
              placeholder="Szukaj achievementu…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="filter-btns">
              {(
                [
                  ['all', 'Wszystkie'],
                  ['unlocked', 'Odblokowane'],
                  ['locked', 'Zablokowane'],
                  ['rare', 'Rzadkie'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  className={'chip' + (filtr === k ? ' on' : '')}
                  onClick={() => setFiltr(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : gosc ? (
        <div className="note">
          <ZalogujStan
            tekst={
              <>
                <b>641 ikon czeka na Twoje nazwisko.</b> Załóż konto i podłącz Steam, a katalog
                zamieni się w Twoją kolekcję — z datami i rzadkością każdego odblokowania.
              </>
            }
            poza={
              <>
                Katalog przeglądasz i bez konta — kliknij dowolną ikonę, żeby zobaczyć, jak się ją
                zdobywa.
              </>
            }
          />
        </div>
      ) : (
        <div className="note">
          <PustyStan
            nastroj="zacheta"
            tekst={
              <>
                <b>Pusta gablota.</b> Zassij osiągnięcia ze Steama — 641 ikon, daty zdobycia i
                completion marks wskoczą tu same.
              </>
            }
            akcja={
              <button className="btn" onClick={sync} disabled={busy}>
                <Sprite name="trophy" size={18} /> {busy ? 'Ściągam…' : 'Synchronizuj ze Steam'}
              </button>
            }
            poza={
              <>
                Steama podpina się raz — w <a href="/kim-jestem">edytorze profilu</a>.
              </>
            }
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
            <EncDetal wpis={naWpis(sel)} onZamknij={() => setSel(null)} />
          </div>,
          document.body,
        )}
    </section>
  )
}
