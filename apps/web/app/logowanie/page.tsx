import { redirect } from 'next/navigation'
import LogowanieForm from '@/components/LogowanieForm'
import { mojGracz } from '@/lib/konto'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Logowanie — IsaacDex' }

export default async function LogowaniePage() {
  // Zalogowanego nie ma po co pytać o hasło.
  if (await mojGracz()) redirect('/profil')

  return (
    <section className="log-strona">
      <div className="note log-karta">
        <LogowanieForm />
      </div>
    </section>
  )
}
