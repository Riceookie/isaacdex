'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sprite from '@/components/Sprite'
import PoleHasla from '@/components/PoleHasla'
import { useT } from '@/components/JezykProvider'
import { supabasePrzegladarka } from '@/lib/supabase/przegladarka'

/**
 * Ustawienie nowego hasła po kliknięciu linku z maila. Robimy to w przeglądarce, bo link
 * niesie token odzyskiwania w adresie — klient Supabase sam wyłapuje sesję z URL-a
 * (detectSessionInUrl) i zdarzenie PASSWORD_RECOVERY, a potem `updateUser` zmienia hasło.
 */
export default function NoweHasloForm() {
  const router = useRouter()
  const t = useT()
  const [gotowe, setGotowe] = useState(false)
  const [blad, setBlad] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [czekam, setCzekam] = useState(false)

  useEffect(() => {
    const supabase = supabasePrzegladarka()
    // Sesja odzyskiwania wjeżdża z linku asynchronicznie — czekamy na nią zdarzeniem,
    // a jednorazowo sprawdzamy też stan bieżący (gdyby zdarzenie już przeszło).
    const { data } = supabase.auth.onAuthStateChange((_zdarzenie, sesja) => {
      if (sesja) setGotowe(true)
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setGotowe(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  async function ustaw(formularz: FormData) {
    setBlad(null)
    setCzekam(true)
    const haslo = String(formularz.get('haslo') ?? '')
    if (haslo.length < 8) {
      setBlad(t('konto.bladHaslo'))
      setCzekam(false)
      return
    }
    const supabase = supabasePrzegladarka()
    const { error } = await supabase.auth.updateUser({ password: haslo })
    setCzekam(false)
    if (error) {
      setBlad(t('konto.bladZmianyHasla'))
      return
    }
    setOk(true)
    // Nowe hasło ustawione = jesteś zalogowany; po chwili prowadzimy na profil.
    setTimeout(() => router.push('/profil'), 1200)
  }

  if (ok) {
    return (
      <p className="log-info" role="status">
        <Sprite name="heart" size={14} /> {t('konto.hasloZmienione')}
      </p>
    )
  }

  return (
    <form className="log-form" action={ustaw}>
      {/* Placeholder zostaje domyślny („co najmniej 8 znaków") — inny byłby tu tylko szumem. */}
      <PoleHasla etykieta={t('konto.noweHaslo')} autoComplete="new-password" />

      {!gotowe && !blad && <p className="muted small">{t('konto.otworzZLinku')}</p>}
      {blad && (
        <p className="log-blad" role="alert">
          <Sprite name="skull" size={14} /> {blad}
        </p>
      )}

      <button className="btn full" type="submit" disabled={!gotowe || czekam}>
        {t(czekam ? 'konto.chwila' : 'konto.ustawNoweHaslo')}
      </button>

      <p className="muted small log-stopka">
        <Link href="/logowanie">{t('konto.wrocDoLogowania')}</Link>
      </p>
    </form>
  )
}
