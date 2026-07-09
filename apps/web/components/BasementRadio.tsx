import Sprite from '@/components/Sprite'
import { ikonaPostaci } from '@/lib/chars'
import { seedDnia } from '@/lib/dailySeed'

/** „Basement Radio" — seed dnia + polecana postać/trudność + ilu graczy ukończyło. */
export default function BasementRadio() {
  const s = seedDnia(new Date())
  return (
    <div className="note radio-card pin-featured">
      <h3>
        <Sprite name="d6" size={22} /> Basement Radio
      </h3>

      <div className="radio-seed">
        <span className="muted small">Seed dnia</span>
        <b className="radio-code">{s.seed}</b>
      </div>

      <div className="radio-facts">
        <span className="radio-fact">
          <img src={ikonaPostaci(s.postac)} alt="" />
          {s.postac}
        </span>
        <span className="radio-fact">
          <Sprite name={s.trudnosc === 'Hard' ? 'skull' : 'moon'} size={18} />
          {s.trudnosc}
        </span>
      </div>

      <p className="muted small radio-finishers">
        <Sprite name="trophy" size={16} /> {s.finishers} osób ukończyło dziś
      </p>
    </div>
  )
}
