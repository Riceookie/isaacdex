import CzatWidok from '@/components/CzatWidok'
import { getProfil } from '@/lib/queries'
import { getGracze } from '@/lib/social'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Czat — IsaacDex' }

/**
 * Czat piwnicy. Wiadomości są DEMO (żyją w stanie komponentu — nie ma backendu czatu),
 * ale rozmówcy są PRAWDZIWI: nicki, kolory, pfp i to, kto jest Twoim znajomym, bierzemy
 * z bazy — więc w czacie siedzą ci sami ludzie co u Znajomych, a prywatne rozmowy
 * otwierają się tylko z tymi, których obserwowanie jest odwzajemnione.
 */
export default async function CzatPage() {
  const [profil, gracze] = await Promise.all([getProfil(), getGracze()])

  const rozmowcy = gracze.map((g) => ({
    nick: g.nick,
    kolor: g.kolor,
    avatar: g.avatar,
    ja: g.ja,
    znajomy: g.znajomy,
  }))

  const ja = gracze.find((g) => g.ja)

  return (
    <section className="cz-strona">
      <CzatWidok gracze={rozmowcy} mojNick={ja?.nick ?? profil?.nick ?? 'Ty'} />
    </section>
  )
}
