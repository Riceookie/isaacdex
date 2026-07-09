'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Plamy krwi (organiczne bloby + krople) — ciemna czerwień.
const STAINS = [
  `<svg width="46" height="42" viewBox="0 0 46 42" xmlns="http://www.w3.org/2000/svg"><path fill="#6d1610" d="M18 4c6-3 13 1 15 7 2 5 8 5 9 11 1 6-4 12-11 12-5 0-8 3-14 2C9 35 3 30 3 22 3 15 6 9 18 4z"/><circle fill="#6d1610" cx="40" cy="9" r="2.4"/><circle fill="#6d1610" cx="8" cy="37" r="1.8"/><circle fill="#6d1610" cx="44" cy="30" r="1.4"/></svg>`,
  `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path fill="#5c0f0a" d="M20 3c4 4 10 4 12 10s-2 11 1 15c2 4-3 9-8 8-6-1-9 3-14-1C6 40 3 33 6 26c2-5-1-9 3-14 3-4 7-5 11-9z"/><circle fill="#5c0f0a" cx="6" cy="9" r="2"/><circle fill="#5c0f0a" cx="35" cy="34" r="1.6"/></svg>`,
]

// Odręczne doodle (kredka, currentColor).
const DOODLES = [
  `<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><circle cx="11.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="20.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M10 19c2 3 10 3 12 0"/></svg>`,
  `<svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><circle cx="11.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><circle cx="20.5" cy="13" r="1.2" fill="currentColor" stroke="none"/><path d="M10 22c2-3 10-3 12 0"/></svg>`,
  `<svg width="30" height="26" viewBox="0 0 32 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="16" rx="4" ry="5"/><path d="M12 12C7 8 3 9 3 12c0 2 4 3 8 2"/><path d="M20 12c5-4 9-3 9 0 0 2-4 3-8 2"/><path d="M16 6v3"/></svg>`,
  `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6c4 3 8 0 12 3s7 1 8 5"/><path d="M4 14c5 2 8-2 12 1s6 0 8 4"/></svg>`,
]

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const rand = (a: number, b: number) => a + Math.random() * (b - a)

/**
 * Rozsypuje faktury w rogach kartek: losowe plamy krwi i odręczne doodle.
 * Dorysowywane po zamontowaniu (klient), inne przy każdym wejściu/nawigacji.
 * Nieklikalne, delikatne. Sprząta po sobie przy odejściu ze strony.
 */
export default function CardDecor() {
  const pathname = usePathname()

  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.container .note, .container .card, .container .profil-hero',
      ),
    )
    const dodane: HTMLElement[] = []

    for (const card of cards) {
      if (Math.random() > 0.4) continue // tylko część kartek dostaje ozdobę
      const stain = Math.random() < 0.45
      const el = document.createElement('span')
      el.className = 'card-decor ' + (stain ? 'is-stain' : 'is-doodle')
      el.innerHTML = stain ? pick(STAINS) : pick(DOODLES)

      const top = Math.random() < 0.5
      const left = Math.random() < 0.5
      el.style[top ? 'top' : 'bottom'] = `${rand(4, 16)}px`
      el.style[left ? 'left' : 'right'] = `${rand(6, 20)}px`
      el.style.transform = `rotate(${rand(-22, 22)}deg) scale(${rand(0.8, 1.3).toFixed(2)})`

      card.appendChild(el)
      dodane.push(el)
    }

    return () => dodane.forEach((e) => e.remove())
  }, [pathname])

  return null
}
