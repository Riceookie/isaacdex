/**
 * Przycisk zamknięcia modala — czerwony X ze sprite'a gry, zawsze w prawym górnym rogu.
 * Jeden komponent dla wszystkich modali, żeby nie rozjeżdżały się warianty.
 */
export default function Zamknij({ onClick }: { onClick: () => void }) {
  return (
    <button className="modal-x" onClick={onClick} aria-label="Zamknij">
      <img src="/tboi/ui/close.png" alt="" width={22} height={22} aria-hidden draggable={false} />
    </button>
  )
}
