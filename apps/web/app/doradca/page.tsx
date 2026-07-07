import { getItemyZOcena } from '@/lib/queries'
import DoradcaWidok from '@/components/DoradcaWidok'

export const dynamic = 'force-dynamic'

export default async function DoradcaPage() {
  const items = await getItemyZOcena()
  return <DoradcaWidok items={items} />
}
