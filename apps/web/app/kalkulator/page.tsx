import Sprite from '@/components/Sprite'

/** Kalkulator statystyk — na razie zapowiedź; logika liczenia statów dojdzie później. */
export default function KalkulatorPage() {
  return (
    <section className="note paper-panel">
      <div className="paper-head">
        <h2>Kalkulator statystyk</h2>
        <span className="muted small">Wkrótce</span>
      </div>
      <p>
        Tu policzysz, jak przedmioty zmienią Twoje staty — damage, tears, speed, range, shot speed i
        luck — zanim podniesiesz item w grze.
      </p>
      <p className="banner demo">
        <Sprite name="bomb" size={18} /> Sekcja w budowie — na razie sam szkielet nawigacji.
      </p>
    </section>
  )
}
