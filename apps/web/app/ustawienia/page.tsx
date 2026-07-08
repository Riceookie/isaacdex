import FloorSwitcher from '@/components/FloorSwitcher'
import Sprite from '@/components/Sprite'

export const metadata = { title: 'Ustawienia — IsaacDex' }

export default function UstawieniaPage() {
  return (
    <section>
      <h1>
        <Sprite name="gear" size={22} /> Ustawienia
      </h1>

      <div className="note">
        <h2>Motyw</h2>
        <p className="muted small">
          Kolor akcentu całej apki (piętra) oraz kursor-mucha <Sprite name="fly" size={16} />{' '}
          (domyślnie wyłączona). Wybór zapisuje się w przeglądarce.
        </p>
        <div className="settings-row">
          <FloorSwitcher />
        </div>
      </div>
    </section>
  )
}
