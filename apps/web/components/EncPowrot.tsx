import Link from 'next/link'
import Sprite from '@/components/Sprite'

/** Powrót z podsekcji do rozdroża Encyklopedii — ten sam pasek na każdej podstronie. */
export default function EncPowrot({ tytul }: { tytul?: string }) {
  return (
    <div className="enc-powrot">
      <Link className="enc-back" href="/encyklopedia">
        <span aria-hidden>←</span> Encyklopedia
      </Link>
      {tytul && (
        <span className="enc-tytul">
          <Sprite name="book" size={16} /> {tytul}
        </span>
      )}
    </div>
  )
}
