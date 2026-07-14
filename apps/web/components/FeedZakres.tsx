import Link from 'next/link'
import Sprite from '@/components/Sprite'
import type { ZakresFeedu } from '@/lib/social'

/**
 * Przełącznik dwóch osobnych feedów: znajomych i globalnego.
 * Zakres siedzi w URL-u (?feed=…), więc da się go zalinkować i cofnąć przyciskiem wstecz,
 * a strona renderuje się na serwerze — bez migotania.
 *
 * `bazowa` pozwala użyć tego samego przełącznika na Pulpicie i u Znajomych, a `domyslny`
 * mówi, który zakres obowiązuje bez parametru (Pulpit: globalny, Znajomi: znajomi).
 */
export default function FeedZakres({
  zakres,
  bazowa = '/',
  domyslny = 'global',
}: {
  zakres: ZakresFeedu
  bazowa?: string
  domyslny?: ZakresFeedu
}) {
  const href = (cel: ZakresFeedu) => (cel === domyslny ? bazowa : `${bazowa}?feed=${cel}`)

  return (
    <div className="filter-btns feed-zakres" role="tablist">
      <Link
        className={'chip' + (zakres === 'znajomi' ? ' on' : '')}
        href={href('znajomi')}
        role="tab"
        aria-selected={zakres === 'znajomi'}
      >
        <Sprite name="friends" size={15} /> Znajomi
      </Link>
      <Link
        className={'chip' + (zakres === 'global' ? ' on' : '')}
        href={href('global')}
        role="tab"
        aria-selected={zakres === 'global'}
      >
        <Sprite name="friendfinder" size={15} /> Globalny
      </Link>
    </div>
  )
}
