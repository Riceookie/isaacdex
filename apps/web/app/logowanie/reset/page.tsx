import Link from 'next/link'
import { redirect } from 'next/navigation'
import Sprite from '@/components/Sprite'
import { mojGracz } from '@/lib/konto'
import { zresetujHaslo } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Reset hasła — IsaacDex' }

const BLEDY: Record<string, string> = {
  nieskonfigurowane: 'Logowanie nie jest jeszcze skonfigurowane na tym serwerze.',
  klucz:
    'Klucz Supabase na tym serwerze jest nieprawidłowy — resetu nie da się teraz wysłać. To usterka po naszej stronie.',
  email: 'To nie wygląda na adres e-mail.',
}
const INFO: Record<string, string> = {
  wyslano: 'Jeśli takie konto istnieje, wysłaliśmy link do zresetowania hasła. Sprawdź skrzynkę.',
}

export default async function ResetPage({
  searchParams,
}: {
  searchParams: { blad?: string; info?: string }
}) {
  if (await mojGracz()) redirect('/profil')
  const blad = searchParams.blad ? BLEDY[searchParams.blad] : undefined
  const info = searchParams.info ? INFO[searchParams.info] : undefined

  return (
    <section className="log-strona">
      <div className="note log-karta">
        <div className="log-box">
          <header className="log-head">
            <Sprite name="momsEye" size={40} />
            <div>
              <h1>Reset hasła</h1>
              <p className="muted small">Podaj e-mail konta — wyślemy link do ustawienia nowego.</p>
            </div>
          </header>

          <form className="log-form" action={zresetujHaslo}>
            <label className="log-pole">
              <span>E-mail</span>
              <input
                className="input"
                name="email"
                type="email"
                required
                placeholder="ty@example.com"
                autoComplete="email"
              />
            </label>

            {blad && (
              <p className="log-blad" role="alert">
                <Sprite name="skull" size={14} /> {blad}
              </p>
            )}
            {info && (
              <p className="log-info" role="status">
                <Sprite name="heart" size={14} /> {info}
              </p>
            )}

            <button className="btn full" type="submit">
              Wyślij link resetujący
            </button>
          </form>

          <p className="muted small log-stopka">
            <Link href="/logowanie">← Wróć do logowania</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
