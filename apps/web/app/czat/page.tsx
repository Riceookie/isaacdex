import CzatWidok from '@/components/CzatWidok'
import { getProfil } from '@/lib/queries'
import { getGracze } from '@/lib/social'
import { czyZalogowany } from '@/lib/konto'
import { getWiadomosci } from '@/lib/wiadomosci'
import { DOMYSLNY_KANAL } from '@/lib/czat'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Czat — IsaacDex' }

/**
 * Czat piwnicy. Wiadomości są prawdziwe: leżą w bazie, przeżywają odświeżenie i dolatują
 * do wszystkich przez Realtime. Rozmówcy też są prawdziwi — nicki, kolory, pfp i to, kto
 * jest Twoim znajomym, bierzemy z bazy, więc w czacie siedzą ci sami ludzie co u Znajomych,
 * a prywatne rozmowy otwierają się tylko z tymi, których obserwowanie jest odwzajemnione.
 *
 * Pierwszy kanał renderuje się na serwerze (czat jest od razu widoczny, bez migotania),
 * kolejne dociąga już przeglądarka.
 */
export default async function CzatPage() {
  const [profil, gracze, zalogowany, startowy] = await Promise.all([
    getProfil(),
    getGracze(),
    czyZalogowany(),
    getWiadomosci(DOMYSLNY_KANAL),
  ])
  const gosc = !zalogowany

  const rozmowcy = gracze.map((g) => ({
    nick: g.nick,
    kolor: g.kolor,
    avatar: g.avatar,
    // Gość nie jest nikim z listy — nie oznaczamy właściciela apki jako „to Ty".
    ja: gosc ? false : g.ja,
    znajomy: gosc ? false : g.znajomy,
  }))

  const ja = gracze.find((g) => g.ja)

  return (
    <section className="cz-strona">
      <CzatWidok
        gracze={rozmowcy}
        mojNick={gosc ? 'Ty' : (ja?.nick ?? profil?.nick ?? 'Ty')}
        gosc={gosc}
        startowe={startowy.wiadomosci}
        startowyKanalDb={startowy.kanalDb}
      />
    </section>
  )
}
