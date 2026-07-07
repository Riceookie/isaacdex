import FloorSwitcher from '@/components/FloorSwitcher'

export const metadata = { title: 'Ustawienia — IsaacDex' }

export default function UstawieniaPage() {
  return (
    <section>
      <h1>⚙ Ustawienia</h1>

      <div className="note">
        <h2>Motyw</h2>
        <p className="muted small">
          Kolor akcentu całej apki (piętra) oraz kursor-mucha 🪰 (domyślnie wyłączona). Wybór
          zapisuje się w przeglądarce.
        </p>
        <div className="settings-row">
          <FloorSwitcher />
        </div>
      </div>
    </section>
  )
}
