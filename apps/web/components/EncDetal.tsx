import ItemSprite from '@/components/ItemSprite'
import Sprite, { type SpriteName } from '@/components/Sprite'
import Zamknij from '@/components/Zamknij'
import type { EncWpis } from '@/lib/enc/typy'

/**
 * Szczegóły wpisu Encyklopedii — układ jak na wiki Isaaca:
 * hero (ikona w ramce + nazwa + cytat + znaczniki) → meta → sekcje → odblokowanie.
 * Wszystkie sekcje są opcjonalne, więc ten sam komponent obsługuje itemy, trinkety i postacie.
 */
export default function EncDetal({ wpis, onZamknij }: { wpis: EncWpis; onZamknij: () => void }) {
  const s = wpis.szczegoly ?? {}

  return (
    <div
      className={'modal paper enc-detal' + (wpis.klasa ? ' ' + wpis.klasa : '')}
      role="dialog"
      aria-modal="true"
      aria-label={wpis.nazwa}
      onClick={(e) => e.stopPropagation()}
    >
      <Zamknij onClick={onZamknij} />

      <header className="ed-hero">
        <span className="ed-ramka">
          <Ikona wpis={wpis} size={64} />
        </span>
        <div className="ed-tytul">
          <h2>{wpis.nazwa}</h2>
          {s.cytat && <p className="ed-cytat">„{s.cytat}"</p>}
          {s.znaczniki && s.znaczniki.length > 0 && (
            <div className="ed-znaczniki">
              {s.znaczniki.map((z) => (
                <span key={z} className="chip xs">
                  {z}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {(s.pola?.length || s.jakosc != null) && (
        <dl className="ed-meta">
          {s.jakosc != null && (
            <div className="ed-wiersz">
              <dt>Jakość</dt>
              <dd>
                <Gwiazdki n={s.jakosc} />
              </dd>
            </div>
          )}
          {s.pola?.map((p) => (
            <div className="ed-wiersz" key={p.label}>
              <dt>{p.label}</dt>
              <dd>{p.wartosc}</dd>
            </div>
          ))}
        </dl>
      )}

      {s.pule && s.pule.length > 0 && (
        <Sekcja tytul="Pule itemów" icon="coin">
          <div className="filter-btns">
            {s.pule.map((p) => (
              <span key={p} className="chip xs">
                {p}
              </span>
            ))}
          </div>
        </Sekcja>
      )}

      {s.efekty && s.efekty.length > 0 && (
        <Sekcja tytul="Zmienia" icon="stats">
          <div className="filter-btns">
            {s.efekty.map((e) => (
              <span key={e} className="chip xs">
                {e}
              </span>
            ))}
          </div>
        </Sekcja>
      )}

      {s.itemy && s.itemy.length > 0 && (
        <Sekcja tytul={s.itemyTytul ?? 'Itemy startowe'} icon="d6">
          <div className="ed-itemy">
            {s.itemy.map((i) => (
              <span key={`${i.typ ?? ''}${i.idW}`} className="ed-item">
                <ItemSprite nazwa={i.nazwa} idW={i.idW} typ={i.typ} size={28} />
                {i.nazwa}
              </span>
            ))}
          </div>
        </Sekcja>
      )}

      {(s.podglad?.postac || s.podglad?.gra || s.podglad?.lzy) && (
        <Sekcja tytul="Wygląd" icon="isaacHead">
          <div className="ed-podglad">
            {s.podglad.postac && (
              <figure>
                <img src={s.podglad.postac} alt={`Wygląd: ${wpis.nazwa}`} />
                <figcaption className="muted small">
                  {s.podglad.podpis ?? 'Isaac z tym itemem'}
                </figcaption>
              </figure>
            )}
            {s.podglad.gra && (
              <figure>
                <img src={s.podglad.gra} alt={`${wpis.nazwa} w grze`} />
                <figcaption className="muted small">{s.podglad.podpisGra ?? 'W grze'}</figcaption>
              </figure>
            )}
            {s.podglad.lzy && (
              <figure>
                <img src={s.podglad.lzy} alt={`Łzy po wzięciu ${wpis.nazwa}`} />
                <figcaption className="muted small">Efekt łez</figcaption>
              </figure>
            )}
          </div>
        </Sekcja>
      )}

      {s.pelnyOpis && (
        <Sekcja tytul="Opis" icon="book">
          <p className="ed-opis">{s.pelnyOpis}</p>
        </Sekcja>
      )}

      {s.odblokowanie && (
        <Sekcja tytul="Odblokowanie" icon="trophy">
          <p className={'ed-unlock' + (s.odblokowanie.zdobyte ? ' zdobyte' : '')}>
            <strong>{s.odblokowanie.nazwa}</strong>
            {s.odblokowanie.warunek && <span className="ed-warunek">{s.odblokowanie.warunek}</span>}
            {s.odblokowanie.zdobyte !== undefined && (
              <span className="muted small">
                {s.odblokowanie.zdobyte
                  ? 'Masz ten achievement.'
                  : 'Nie masz jeszcze tego achievementu.'}
              </span>
            )}
          </p>
        </Sekcja>
      )}
    </div>
  )
}

function Sekcja({
  tytul,
  icon,
  children,
}: {
  tytul: string
  icon: SpriteName
  children: React.ReactNode
}) {
  return (
    <section className="ed-sekcja">
      <h3>
        <Sprite name={icon} size={16} /> {tytul}
      </h3>
      {children}
    </section>
  )
}

/** Jakość 0–4 jako gwiazdki (puste = do pełnych czterech). */
function Gwiazdki({ n }: { n: number }) {
  // Gwiazdki świecą KOLOREM JAKOŚCI (Q0 szary … Q4 złoty) — tą samą skalą co odznaki
  // w Encyklopedii i obwódki w gablocie. Wcześniej były złote niezależnie od poziomu,
  // więc Q1 wyglądał jak legenda.
  return (
    <span className={`ed-stars q${n}`} aria-label={`Jakość ${n} na 4`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={'ed-star' + (i < n ? ' on' : '')} aria-hidden>
          ★
        </span>
      ))}
      <span className="muted small"> {n}/4</span>
    </span>
  )
}

function Ikona({ wpis, size }: { wpis: EncWpis; size: number }) {
  if (wpis.ikona) {
    return (
      <img
        src={wpis.ikona}
        alt=""
        width={size}
        height={size}
        className="sprite item-sprite"
        aria-hidden
        draggable={false}
      />
    )
  }
  return <ItemSprite nazwa={wpis.nazwa} idW={wpis.idW} typ={wpis.typ} size={size} />
}
