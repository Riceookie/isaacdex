import { describe, it, expect } from 'vitest'
import { ocenItem, sprawdzReguleHard, procentUkonczenia } from './index'

describe('ocenItem — doradca itemów', () => {
  it('jakość 4 → BIERZ', () => {
    expect(ocenItem({ nazwa: 'Sacred Heart', jakosc: 4, tagi: [] }).rekomendacja).toBe('BIERZ')
  })

  it('jakość 0 → UWAGA', () => {
    expect(ocenItem({ nazwa: 'Breakfast', jakosc: 0, tagi: [] }).rekomendacja).toBe('UWAGA')
  })

  it('pułapka w tagach obniża rekomendację do UWAGA', () => {
    const o = ocenItem({ nazwa: 'The Bible', jakosc: 1, tagi: ['pułapka: zabija na Satanie'] })
    expect(o.rekomendacja).toBe('UWAGA')
    expect(o.powody.length).toBeGreaterThan(1)
  })

  it('The Bible + Satan → UWAGA z powodem kontekstowym', () => {
    const o = ocenItem({ nazwa: 'The Bible', jakosc: 1, tagi: [] }, { przeciwBossowi: 'SATAN' })
    expect(o.rekomendacja).toBe('UWAGA')
    expect(o.powody.some((p) => p.toLowerCase().includes('satan'))).toBe(true)
  })

  it('bez kontekstu item jakości 3 → ZWYKLE_WARTO', () => {
    expect(ocenItem({ nazwa: 'Polyphemus', jakosc: 3, tagi: [] }).rekomendacja).toBe('ZWYKLE_WARTO')
  })
})

describe('sprawdzReguleHard — reguła kolejności HARD≥NORMAL', () => {
  it('HARD bez zaliczonego NORMAL → odrzucone', () => {
    const r = sprawdzReguleHard('HARD', false)
    expect(r.ok).toBe(false)
    expect(r.powod).toBeTruthy()
  })

  it('HARD po zaliczonym NORMAL → ok', () => {
    expect(sprawdzReguleHard('HARD', true).ok).toBe(true)
  })

  it('NORMAL zawsze dozwolony', () => {
    expect(sprawdzReguleHard('NORMAL', false).ok).toBe(true)
  })
})

describe('procentUkonczenia', () => {
  it('liczy procent i zaokrągla', () => {
    expect(procentUkonczenia(1, 4)).toBe(25)
    expect(procentUkonczenia(1, 3)).toBe(33)
  })

  it('0 z 0 → 0 (brak dzielenia przez zero)', () => {
    expect(procentUkonczenia(0, 0)).toBe(0)
  })
})
