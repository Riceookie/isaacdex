import { getKolekcja } from '@/lib/queries'
import { czyZalogowany } from '@/lib/konto'
import KolekcjaWidok from '@/components/KolekcjaWidok'

export const dynamic = 'force-dynamic'

export default async function KolekcjaPage() {
  const [{ achievements, ostatniSync }, zalogowany] = await Promise.all([
    getKolekcja(),
    czyZalogowany(),
  ])
  return <KolekcjaWidok achievements={achievements} ostatniSync={ostatniSync} gosc={!zalogowany} />
}
