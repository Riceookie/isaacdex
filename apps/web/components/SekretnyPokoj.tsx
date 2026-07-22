'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { sprawdzKrok } from '@/app/actions/sekret'
import WagaChciwosci from '@/components/minigry/WagaChciwosci'
import UderzKreta from '@/components/minigry/UderzKreta'
import RuletkaPigulek from '@/components/minigry/RuletkaPigulek'
import UnikFetus from '@/components/minigry/UnikFetus'
import LadowanieBaterii from '@/components/minigry/LadowanieBaterii'

/**
 * Wyzwanie Sekretnego Pokoju — rytuał z PIĘCIU kroków:
 *   zagadka 1 → mini-gra „Łapanie Monet" → zagadka 2 → mini-gra „Waga Chciwości" → zagadka 3.
 * Ten komponent jest orkiestratorem: prowadzi przez sekwencję, trzyma pasek postępu i animacje
 * przejść. Zagadki tekstowe sprawdza WYŁĄCZNIE server action `sprawdzKrok` (odpowiedzi nie ma
 * w bundlu). Mini-gry to bramki po stronie klienta — wołają `onWin`, gdy się skończą. Ostatnia
 * zagadka domyka rytuał: leci pełnoekranowy rozbłysk, a potem przejście na ekran nagrody
 * (`/sekret?ok=1`), gdzie Shopkeeper „podnosi wzrok", gra dżingiel i wpada tytuł „Keeper".
 *
 * Wymaga JS (to ukryte easter-egg za zbombardowaną ścianą, nie ścieżka krytyczna).
 */
type GraId = 'waga' | 'krety' | 'pigulki' | 'fetus' | 'bateria'
type Krok = { typ: 'zagadka'; idx: 0 | 1 | 2 } | { typ: 'gra'; gra: GraId }

// Rytuał: 3 zagadki tekstowe (idx 0/1/2) przeplecione 5 mini-grami; kończy się na zagadce 2,
// bo to ona (server-side) nadaje nagrodę.
const SEKWENCJA: Krok[] = [
  { typ: 'zagadka', idx: 0 },
  { typ: 'gra', gra: 'waga' },
  { typ: 'gra', gra: 'krety' },
  { typ: 'zagadka', idx: 1 },
  { typ: 'gra', gra: 'pigulki' },
  { typ: 'gra', gra: 'fetus' },
  { typ: 'gra', gra: 'bateria' },
  { typ: 'zagadka', idx: 2 },
]

type Faza = 'pyt' | 'sprawdzanie' | 'zle' | 'otwarta' | 'final'

/** Mały wektorowy glif wagi do węzła „Waga Chciwości" na pasku postępu. */
function GlifWagi() {
  return (
    <svg viewBox="0 0 24 24" className="sekret-krok-glif" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 4v15M6 19h12M5 8h14" />
        <path d="M5 8l-2.5 5h5zM19 8l-2.5 5h5z" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

/** Ikona węzła mini-gry na pasku postępu — tematyczny sprite/glif per gra. */
function IkonaGry({ gra }: { gra: GraId }) {
  if (gra === 'waga') return <GlifWagi />
  const src: Record<Exclude<GraId, 'waga'>, string> = {
    krety: 'przeciwnicy/mole.png',
    pigulki: 'items/collectibles/momsbottleofpills.png',
    fetus: 'items/collectibles/epicfetus.png',
    bateria: 'icons/battery.webp',
  }
  return <img className="sekret-krok-ikona" src={`/tboi/${src[gra]}`} alt="" />
}

export default function SekretnyPokoj() {
  const t = useT()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [pozycja, setPozycja] = useState(0) // 0..4 — który krok sekwencji
  const [faza, setFaza] = useState<Faza>('pyt')

  const krok = SEKWENCJA[pozycja]
  const zajete = faza === 'sprawdzanie' || faza === 'otwarta' || faza === 'final'

  // Mini-gra skończona → następny krok (zwykle zagadka), pole startuje puste i z autofocusem.
  function naDalej() {
    setPozycja((p) => p + 1)
    setFaza('pyt')
  }

  async function nasluchaj(e: React.FormEvent) {
    e.preventDefault()
    if (zajete || krok.typ !== 'zagadka') return
    const val = inputRef.current?.value.trim() ?? ''
    if (!val) return

    setFaza('sprawdzanie')
    let res: { ok: boolean; koniec?: boolean }
    try {
      res = await sprawdzKrok(krok.idx, val)
    } catch {
      res = { ok: false }
    }

    if (!res.ok) {
      setFaza('zle')
      inputRef.current?.focus()
      inputRef.current?.select()
      return
    }
    if (res.koniec) {
      setFaza('final')
      window.setTimeout(() => router.push('/sekret?ok=1'), 2600)
      return
    }
    // Zagadka pękła: rozbłysk, po chwili odsłoń następny krok.
    setFaza('otwarta')
    window.setTimeout(() => {
      setPozycja((p) => p + 1)
      if (inputRef.current) inputRef.current.value = ''
      setFaza('pyt')
    }, 1000)
  }

  // Finał: krótki rytuał zamiast panelu (przejdziemy na ekran nagrody).
  if (faza === 'final') {
    return (
      <div className="sekret-panel sekret-final" role="status">
        <span className="sekret-final-blysk" aria-hidden />
        <div className="sekret-kroki sekret-kroki-final" aria-hidden>
          {SEKWENCJA.map((_, i) => (
            <span key={i} className="sekret-krok-pkt zapalona" />
          ))}
        </div>
        <h2 className="sekret-final-naglowek">{t('sekret.finalNaglowek')}</h2>
        <p className="sekret-lore">{t('sekret.finalOpis')}</p>
      </div>
    )
  }

  const zagadki = ['sekret.zagadka1', 'sekret.zagadka2', 'sekret.zagadka3'] as const
  const bledy = ['sekret.blad1', 'sekret.blad2', 'sekret.blad3'] as const
  const jestGra = krok.typ === 'gra'

  return (
    <div
      className={
        'sekret-panel ' +
        (jestGra ? 'sekret-panel-gra' : 'sekret-zagadka') +
        (faza === 'zle' ? ' zle' : '')
      }
    >
      {pozycja === 0 && <p className="sekret-lore">{t('sekret.lore')}</p>}

      <p className="sekret-mowi small muted">{t('sekret.wyzwanieNaglowek')}</p>
      {pozycja === 0 && <p className="sekret-podtytul small muted">{t('sekret.wyzwaniePodtytul')}</p>}

      {/* Pasek postępu: 3 runy (zagadki) + 2 węzły mini-gier (moneta, waga). */}
      <div
        className="sekret-kroki"
        role="img"
        aria-label={`${t('sekret.postepAria')}: ${pozycja} / ${SEKWENCJA.length}`}
      >
        {SEKWENCJA.map((s, i) => (
          <span
            key={i}
            className={
              'sekret-krok-pkt ' +
              (s.typ === 'gra' ? 'gra' : 'runa') +
              (i < pozycja ? ' zapalona' : '') +
              (i === pozycja && faza !== 'otwarta' ? ' aktywna' : '') +
              (i === pozycja && faza === 'otwarta' ? ' zapala-sie' : '')
            }
          >
            {s.typ === 'gra' && <IkonaGry gra={s.gra} />}
          </span>
        ))}
      </div>

      {krok.typ === 'zagadka' ? (
        <>
          <blockquote key={pozycja} className="sekret-riddle sekret-riddle-in">
            „{t(zagadki[krok.idx])}"
          </blockquote>

          <form onSubmit={nasluchaj} className="sekret-form">
            <span className="sekret-form-podpis small muted">{t('sekret.polePodpis')}</span>
            <div className="sekret-form-rzad">
              <input
                ref={inputRef}
                name="odpowiedz"
                className="input sekret-szept-pole"
                placeholder={t('sekret.polePlaceholder')}
                autoFocus
                autoComplete="off"
                maxLength={40}
                required
                disabled={zajete}
              />
              <button className="btn sekret-szept-btn" type="submit" disabled={zajete}>
                <Sprite name="shopkeeper" size={16} /> {t('sekret.przycisk')}
              </button>
            </div>
          </form>

          {faza === 'zle' && (
            <p className="sekret-zle small" role="status">
              {t(bledy[krok.idx])}
            </p>
          )}
          {faza === 'otwarta' && (
            <p className="sekret-otwarta small" role="status">
              {t('sekret.krokOtwarty')}
            </p>
          )}
        </>
      ) : krok.gra === 'waga' ? (
        <WagaChciwosci key="waga" onWin={naDalej} />
      ) : krok.gra === 'krety' ? (
        <UderzKreta key="krety" onWin={naDalej} />
      ) : krok.gra === 'pigulki' ? (
        <RuletkaPigulek key="pigulki" onWin={naDalej} />
      ) : krok.gra === 'fetus' ? (
        <UnikFetus key="fetus" onWin={naDalej} />
      ) : (
        <LadowanieBaterii key="bateria" onWin={naDalej} />
      )}
    </div>
  )
}
