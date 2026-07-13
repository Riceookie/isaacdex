/**
 * Stan ładowania sekcji Encyklopedii — szkielet o kształcie docelowej listy (pasek narzędzi
 * + siatka kart). Strony są `force-dynamic` i ciągną dane z bazy, więc bez tego widać
 * gołą stronę przez chwilę.
 */
export default function EncSzkielet({ kart = 18 }: { kart?: number }) {
  return (
    <section className="note paper-panel" aria-busy="true" aria-live="polite">
      <span className="szkielet szk-linia w40" />
      <div className="kol-tools">
        <span className="szkielet szk-input" />
        <span className="szkielet szk-chip" />
        <span className="szkielet szk-chip" />
        <span className="szkielet szk-chip" />
      </div>
      <div className="item-grid">
        {Array.from({ length: kart }, (_, i) => (
          <span key={i} className="szkielet szk-karta" />
        ))}
      </div>
      <span className="sr-only">Wczytywanie…</span>
    </section>
  )
}
