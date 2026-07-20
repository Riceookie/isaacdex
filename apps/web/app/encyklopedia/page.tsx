import Link from 'next/link'
import { SEKCJE, SEKCJE_W_BUDOWIE } from '@/lib/encyklopedia'
import { tlumacz } from '@/lib/i18n/serwer'

/** Hub Encyklopedii — rozdroże do sekcji. Gotowe sekcje są linkiem, reszta czeka na treść. */
export default function EncyklopediaPage() {
  const t = tlumacz()

  return (
    <section className="note paper-panel">
      <div className="paper-head">
        <h2>{t('encyklopedia.tytul')}</h2>
        {/* Gdy wszystko gotowe, „0 sekcji w budowie" to informacja o niczym — znika. */}
        {SEKCJE_W_BUDOWIE > 0 && (
          <span className="muted small">
            {t('encyklopedia.sekcjiWBudowie', { liczba: SEKCJE_W_BUDOWIE })}
          </span>
        )}
      </div>
      <p className="muted">{t('encyklopedia.hubOpis')}</p>

      <div className="tiles">
        {SEKCJE.map((s) => (
          <Link key={s.slug} className="tile" href={s.href}>
            <img
              src={s.ikona}
              alt=""
              width={28}
              height={28}
              className="sprite"
              aria-hidden
              draggable={false}
            />
            <strong>{t(s.labelKlucz)}</strong>
            <span className="muted small">{t(s.opisKlucz)}</span>
            {!s.gotowe && <span className="muted small">{t('wspolne.wkrotce')}</span>}
          </Link>
        ))}
      </div>
    </section>
  )
}
