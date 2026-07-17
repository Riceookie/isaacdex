import { supabasePrzegladarka } from '@/lib/supabase/przegladarka'

/** Największy załącznik. Czat to nie hosting zrzutów — 3 MB wystarczy na screena z gry. */
export const MAX_OBRAZEK = 3 * 1024 * 1024

/** Kubełek w Supabase Storage (publiczny do odczytu, zapis tylko dla zalogowanych). */
const KUBELEK = 'czat'

/**
 * Wysyła obrazek do Storage i zwraca jego publiczny adres (albo null, gdy się nie udało).
 *
 * Leci z PRZEGLĄDARKI, a nie server action: plik poszedłby wtedy dwa razy przez sieć
 * (do naszego serwera, potem do Storage), a limit ciała akcji w Next jest mały.
 * Zapisu pilnuje polityka na `storage.objects` — wgrać może tylko zalogowany.
 */
export async function wgrajObrazek(plik: File): Promise<string | null> {
  if (!plik.type.startsWith('image/') || plik.size > MAX_OBRAZEK) return null

  const supabase = supabasePrzegladarka()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Nazwa z ID użytkownika i czasu: nie da się nadpisać cudzego pliku ani swojego starego.
  const rozszerzenie = plik.name.split('.').pop()?.toLowerCase().slice(0, 5) || 'png'
  const sciezka = `${user.id}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${rozszerzenie}`

  const { error } = await supabase.storage
    .from(KUBELEK)
    .upload(sciezka, plik, { contentType: plik.type, upsert: false })
  if (error) return null

  return supabase.storage.from(KUBELEK).getPublicUrl(sciezka).data.publicUrl
}

/**
 * Avatar profilu → Supabase Storage, zwraca publiczny adres.
 *
 * Dlaczego nie data: URL prosto do bazy (tak było, gdy avatar siedział w localStorage):
 *  - `avatarGracza()` uznaje za obrazek tylko to, co zaczyna się od „/" albo „http", więc
 *    data-URL brałby za NAZWĘ POSTACI i zamieniał w zepsutą ścieżkę — avatar znikał wszędzie;
 *  - 512×512 webp to ~50 kB base64 w KAŻDEJ odpowiedzi z graczem (feed, czat, listy).
 *
 * Wejście to data-URL z `AvatarUpload` (już przeskalowany do kwadratu), więc tu tylko
 * zamieniamy go na plik i wysyłamy tą samą drogą co załączniki czatu.
 */
export async function wgrajAvatar(dataUrl: string): Promise<string | null> {
  if (!dataUrl.startsWith('data:')) return dataUrl // już adres — nie ma co wysyłać
  try {
    const blob = await (await fetch(dataUrl)).blob()
    return await wgrajObrazek(new File([blob], 'avatar.webp', { type: blob.type || 'image/webp' }))
  } catch {
    return null
  }
}
