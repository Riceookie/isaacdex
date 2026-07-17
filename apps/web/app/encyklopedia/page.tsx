import Link from 'next/link'
import Sprite from '@/components/Sprite'
import { SEKCJE, SEKCJE_W_BUDOWIE } from '@/lib/encyklopedia'

/** Hub Encyklopedii — rozdroże do sekcji. Gotowe sekcje są linkiem, reszta czeka na treść. */
export default function EncyklopediaPage() {
  return (
    <section className="note paper-panel">
      <div className="paper-head">
        <h2>Encyklopedia</h2>
        {/* Gdy wszystko gotowe, „0 sekcji w budowie" to informacja o niczym — znika. */}
        {SEKCJE_W_BUDOWIE > 0 && (
          <span className="muted small">{SEKCJE_W_BUDOWIE} sekcji w budowie</span>
        )}
      </div>
      <p className="muted">Wszystko o Isaacu w jednym miejscu — wybierz dział.</p>

      <div className="tiles">
        {SEKCJE.map((s) => (
          <Link key={s.slug} className="tile" href={s.href}>
            <Sprite name={s.icon} size={28} />
            <strong>{s.label}</strong>
            <span className="muted small">{s.opis}</span>
            {!s.gotowe && <span className="muted small">Wkrótce</span>}
          </Link>
        ))}
      </div>
    </section>
  )
}
