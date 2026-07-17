import Ladowanie from '@/components/Ladowanie'

// Szkielet pod nawigacją: profil jest force-dynamic, więc klik w nick pokazuje
// natychmiast tę kartkę, a nie zamrożoną poprzednią stronę.
export default function Loading() {
  return (
    <section className="note paper-panel">
      <Ladowanie />
    </section>
  )
}
