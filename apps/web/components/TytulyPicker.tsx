'use client'

import { ikonaPostaci } from '@/lib/chars'
import Sprite from '@/components/Sprite'
import { useT } from '@/components/JezykProvider'
import { KATALOG_TYTULOW, type Odznaka } from '@/lib/odznaki'

/**
 * Wybór tytułu pod nickiem + mała KOLEKCJA wszystkich tytułów.
 *
 * Tytuły są NADAWANE (liczy je lib/odznaki z prawdziwych danych) — tu nie da się żadnego
 * „przyznać", można tylko wskazać, KTÓRY ze zdobytych ma wisieć jako pierwszy. Dlatego:
 *  - „Auto" = domyślnie najwyższy zdobyty (wybór = null),
 *  - zdobyte tytuły są klikalne (radio),
 *  - reszta katalogu stoi wyszarzona z podpowiedzią „jak zdobyć" — jak zamki w pickerze
 *    dekoracji. Dzięki temu widać całą kolekcję, a nie tylko to, co już się ma.
 *
 * `odznaki` to zdobyte tytuły (pełna lista, nieprzycięta do MAKS_ODZNAK) — po to serwer liczy
 * je raz i podaje niżej, żeby klient nie musiał znać reguł nadawania.
 */
export default function TytulyPicker({
  odznaki,
  wybrany,
  onWybierz,
}: {
  odznaki: Odznaka[]
  wybrany: string | null
  onWybierz: (id: string | null) => void
}) {
  const t = useT()
  const zdobyte = new Map(odznaki.map((o) => [o.id, o]))
  const maZdobyte = odznaki.length > 0

  return (
    <div className="side-note">
      <span className="side-label">{t('profil.tytulSekcja')}</span>
      <p className="small muted tytul-opis">{t('profil.tytulOpis')}</p>

      <div className="tytul-picker">
        {/* „Auto" zawsze pierwsze — bezpieczny domyślny wybór (najwyższy zdobyty). */}
        <button
          type="button"
          className={'tytul-pick auto' + (wybrany === null ? ' sel' : '')}
          onClick={() => onWybierz(null)}
          data-tip={t('profil.tytulAutoOpis')}
        >
          <Sprite name="d6" size={14} />
          <span>{t('profil.tytulAuto')}</span>
        </button>

        {/* Cały katalog: zdobyte klikalne, reszta wyszarzona z warunkiem. */}
        {KATALOG_TYTULOW.map((k) => {
          const zdobyta = zdobyte.get(k.id)
          if (zdobyta) {
            const etykieta = t(zdobyta.klucz, zdobyta.zmienne)
            return (
              <button
                key={k.id}
                type="button"
                className={
                  'tytul-pick pf-odznaka ' + zdobyta.wariant + (wybrany === k.id ? ' sel' : '')
                }
                onClick={() => onWybierz(k.id)}
                data-tip={t(zdobyta.kluczOpisu, zdobyta.zmienne)}
                aria-pressed={wybrany === k.id}
              >
                {zdobyta.postac ? (
                  <img
                    className="pf-odznaka-ikona"
                    src={ikonaPostaci(zdobyta.postac)}
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden
                  />
                ) : (
                  zdobyta.sprite && <Sprite name={zdobyta.sprite} size={14} />
                )}
                <span>{etykieta}</span>
              </button>
            )
          }
          // Zablokowany — pokazujemy, że istnieje, i jak go zdobyć. Niewybieralny.
          return (
            <span
              key={k.id}
              className={'tytul-pick pf-odznaka ' + k.wariant + ' locked'}
              data-tip={t(k.kluczWarunek)}
              aria-label={t('profil.tytulZablokowanyAria', { nazwa: t(k.klucz) })}
            >
              <Sprite name={k.sprite} size={14} />
              <span>{t(k.klucz)}</span>
              <svg
                className="tytul-lock"
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a4 4 0 00-4 4v3H6.5A1.5 1.5 0 005 10.5v9A1.5 1.5 0 006.5 21h11a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0017.5 9H16V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3h-4V6z" />
              </svg>
            </span>
          )
        })}
      </div>

      {!maZdobyte && <p className="small muted tytul-brak">{t('profil.tytulBrakZdobytych')}</p>}
    </div>
  )
}
