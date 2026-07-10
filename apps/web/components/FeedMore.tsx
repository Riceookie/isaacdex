'use client'

import { useState, type ReactNode } from 'react'

// Zwijane „nadmiarowe" wpisy feedu: domyślnie widać kilka pierwszych, reszta chowa
// się za przyciskiem „Rozwiń", żeby widok mieścił się w oknie bez scrollowania strony.
// Dzieci są server-renderowanymi FeedCardami — tu tylko sterujemy widocznością (bez mutacji DOM).
export default function FeedMore({ children, count }: { children: ReactNode; count: number }) {
  const [open, setOpen] = useState(false)
  if (count <= 0) return null
  return (
    <>
      {open && children}
      <button className="feed-more" type="button" onClick={() => setOpen((v) => !v)}>
        {open ? 'Zwiń' : `Rozwiń (${count})`}
      </button>
    </>
  )
}
