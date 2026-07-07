import { getKolekcja } from '@/lib/queries'
import KolekcjaWidok from '@/components/KolekcjaWidok'

export const dynamic = 'force-dynamic'

export default async function KolekcjaPage() {
  const { achievements } = await getKolekcja()
  return <KolekcjaWidok achievements={achievements} />
}
