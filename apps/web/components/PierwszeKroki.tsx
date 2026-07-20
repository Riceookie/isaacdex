import Link from 'next/link'
import Sprite from '@/components/Sprite'
import type { StanOnboardingu } from '@/lib/onboarding'
import { tlumacz } from '@/lib/i18n/serwer'

/**
 * „Pierwsze kroki" — lista startowa dla świeżego konta, w prawej szynie Pulpitu.
 *
 * Znika sama, gdy wszystko odhaczone (patrz `pokazuj`) — onboarding ma się skończyć, a nie
 * zostać na zawsze jako mebel. Odhaczone kroki zostają widoczne i przekreślone: pasek robi
 * się wtedy dowodem postępu, a nie listą zarzutów.
 */
export default function PierwszeKroki({ stan }: { stan: StanOnboardingu }) {
  const procent = Math.round((stan.zrobione / stan.wszystkie) * 100)
  // Komponent serwerowy — Pulpit jest i tak dynamiczny (czyta zalogowanego gracza).
  const t = tlumacz()

  return (
    <div className="note kroki-card pin-featured">
      <div className="kroki-head">
        <h3>
          <Sprite name="dadsnote" size={20} /> {t('klimat.krokiNaglowek')}
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
              <b className="krok-tytul">{t(k.tytul)}</b>
              <span className="muted small">{t(k.opis)}</span>
            </div>
            {k.zrobiony ? (
              <span className="krok-ptaszek" aria-label={t('klimat.krokiZrobione')}>
                ✓
              </span>
            ) : (
              <Link className="btn maly krok-cta" href={k.href}>
                {t(k.cta)}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Zdanie z dwoma <Link> składamy z trzech kluczy — tekst z <a> w innerHTML robiłby
          twarde przeładowanie strony, a jednego klucza z linkami `t()` nie zwróci (string). */}
      <p className="kroki-stopka muted small">
        {t('klimat.krokiStopkaPrzed')}
        {/* Nazwy sekcji bierzemy z `wspolne`, żeby stopka nie rozjechała się z menu. */}
        <Link href="/encyklopedia">{t('wspolne.navEncyklopedia')}</Link>
        {t('klimat.krokiStopkaMiedzy')}
        <Link href="/kalkulator">{t('wspolne.navKalkulator')}</Link>
        {t('klimat.krokiStopkaPo')}
      </p>
    </div>
  )
}
