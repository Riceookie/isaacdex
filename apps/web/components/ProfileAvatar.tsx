import DecorMark from '@/components/DecorMark'
import { type DecorId } from '@/lib/pfpDecor'

/**
 * Avatar profilu = wgrany obraz albo fallback (głowa postaci), z opcjonalną ozdobą
 * (mucha/pająk/krew…) przypiętą w rogu. Kontener musi być position:relative.
 *
 * Avatar i ozdoba przychodzą z BAZY, jako propsy. Kiedyś komponent czytał je sam
 * z localStorage — przez co Twój profil wyglądał inaczej u Ciebie niż u wszystkich innych
 * (a jeszcze inaczej po zalogowaniu na innym komputerze). Skoro dane są w bazie,
 * nie ma już czego nasłuchiwać i komponent może być zwykły, serwerowy.
 */
export default function ProfileAvatar({
  fallbackSrc,
  avatar,
  dekoracja = 'none',
  className = 'avatar-img',
}: {
  fallbackSrc: string
  /** Wgrany obraz albo null (wtedy leci fallback). */
  avatar?: string | null
  dekoracja?: DecorId
  className?: string
}) {
  // Avatar bywa NAZWĄ POSTACI („Azazel"), a nie adresem — wtedy obrazek daje fallback
  // (ikonę tej postaci), policzony już przez wołającego.
  const src = avatar && (avatar.startsWith('/') || avatar.startsWith('http')) ? avatar : fallbackSrc

  return (
    <>
      <img className={className} src={src} alt="" draggable={false} />
      <DecorMark id={dekoracja} />
    </>
  )
}
