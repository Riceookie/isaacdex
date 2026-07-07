import { getProfilSetup } from '@/lib/queries'
import KimJestemForm from '@/components/KimJestemForm'

export const dynamic = 'force-dynamic'

export default async function KimJestemPage() {
  const dane = await getProfilSetup()
  return (
    <section>
      <KimJestemForm {...dane} />
    </section>
  )
}
