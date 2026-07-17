import Link from 'next/link'
import Sprite from '@/components/Sprite'
import type { StanOnboardingu } from '@/lib/onboarding'

/**
 * „Pierwsze kroki" — lista startowa dla świeżego konta, w prawej szynie Pulpitu.
 *
 * Znika sama, gdy wszystko odhaczone (patrz `pokazuj`) — onboarding ma się skończyć, a nie
 * zostać na zawsze jako mebel. Odhaczone kroki zostają widoczne i przekreślone: pasek robi
 * się wtedy dowodem postępu, a nie listą zarzutów.
 */
export default function PierwszeKroki({ stan }: { stan: StanOnboardingu }) {
  const procent = Math.round((stan.zrobione / stan.wszystkie) * 100)

  return (
    <div className="note kroki-card pin-featured">
      <div className="kroki-head">
        <h3>
          <Sprite name="dadsnote" size={20} /> Pierwsze kroki
        </h3>
        <span className="muted small">
          {stan.zrobione}/{stan.wszystkie}
        </span>
      </div>

      <div className="bar kroki-bar">
        <div className="bar-fill" style={{ width: `${procent}%` }} />
      </div>

      <ul className="kroki-lista">
        {stan.kroki.map((k) => (
          <li key={k.id} className={'krok' + (k.zrobiony ? ' zrobiony' : '')}>
            <span className="krok-ic" aria-hidden>
              <Sprite name={k.ikona} size={20} />
            </span>
            <div className="krok-tresc">
              <b className="krok-tytul">{k.tytul}</b>
              <span className="muted small">{k.opis}</span>
            </div>
            {k.zrobiony ? (
              <span className="krok-ptaszek" aria-label="zrobione">
                ✓
              </span>
            ) : (
              <Link className="btn maly krok-cta" href={k.href}>
                {k.cta}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <p className="kroki-stopka muted small">
        Nie musisz nic z tego robić, żeby pooglądać: <Link href="/encyklopedia">Encyklopedia</Link>{' '}
        i <Link href="/kalkulator">Kalkulator</Link> działają od pierwszej sekundy.
      </p>
    </div>
  )
}
