import { getItemyZOcena } from '@/lib/queries'
import DoradcaWidok from '@/components/DoradcaWidok'

export const dynamic = 'force-dynamic'

/** Sekcja Encyklopedii „Przedmioty" — dawna strona /doradca (przeglądarka itemów + rekomendacja). */
export default async function PrzedmiotyPage() {
  const items = await getItemyZOcena()
  return <DoradcaWidok items={items} />
}
