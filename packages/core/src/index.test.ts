import { describe, it, expect } from 'vitest'
import {
  policzStaty,
  type StatyBazowe,
  ocenItem,
  sprawdzReguleHard,
  procentUkonczenia,
  podsumujMarki,
  klasaRzadkosci,
} from './index'

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

  it('zwraca też rekomendację bazową (z samej jakości)', () => {
    const o = ocenItem({ nazwa: 'The Bible', jakosc: 3, tagi: [] }, { przeciwBossowi: 'SATAN' })
    expect(o.bazowa).toBe('ZWYKLE_WARTO')
    expect(o.rekomendacja).toBe('UWAGA') // reguła kontekstowa obniżyła wynik
  })

  it('pułapka-boss:<BOSS> obniża tylko przy pasującym bossie', () => {
    const item = { nazwa: 'Ludo', jakosc: 3, tagi: ['pułapka-boss:MEGA_SATAN'] }
    expect(ocenItem(item, { przeciwBossowi: 'MEGA_SATAN' }).rekomendacja).toBe('UWAGA')
    // inny boss (albo brak) → tag nie działa, zostaje baza
    expect(ocenItem(item, { przeciwBossowi: 'MOM' }).rekomendacja).toBe('ZWYKLE_WARTO')
    expect(ocenItem(item).rekomendacja).toBe('ZWYKLE_WARTO')
  })

  it('mocny-boss:<BOSS> podnosi rekomendację przy pasującym bossie', () => {
    const item = { nazwa: 'Brimstone', jakosc: 2, tagi: ['mocny-boss:MOM'] }
    expect(ocenItem(item).rekomendacja).toBe('SYTUACYJNIE') // baza
    expect(ocenItem(item, { przeciwBossowi: 'MOM' }).rekomendacja).toBe('ZWYKLE_WARTO') // +1
  })

  it('synergia:<ITEM> podnosi rekomendację, gdy mamy dany item', () => {
    const item = { nazwa: 'Number One', jakosc: 1, tagi: ['synergia:sad onion'] }
    expect(ocenItem(item).rekomendacja).toBe('RACZEJ_POMIN') // baza, nic nie mamy
    const o = ocenItem(item, { posiadaneItemy: ['Sad Onion'] })
    expect(o.rekomendacja).toBe('SYTUACYJNIE') // +1
    expect(o.powody.some((p) => p.toLowerCase().includes('synergia'))).toBe(true)
  })

  it('pułapka wygrywa z synergią (bezpieczeństwo ponad okazją)', () => {
    const item = {
      nazwa: 'Ipecac',
      jakosc: 3,
      tagi: ['synergia:dr. fetus', 'pułapka: łatwo się zabić'],
    }
    const o = ocenItem(item, { posiadaneItemy: ['Dr. Fetus'] })
    expect(o.rekomendacja).toBe('UWAGA')
  })

  it('nie podnosi powyżej BIERZ', () => {
    const item = { nazwa: 'Sacred Heart', jakosc: 4, tagi: ['mocny-boss:MOM'] }
    expect(ocenItem(item, { przeciwBossowi: 'MOM' }).rekomendacja).toBe('BIERZ')
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

describe('podsumujMarki — postęp completion marks', () => {
  const marki = (norm: number, hard: number, bossy: number) =>
    Array.from({ length: bossy }, (_, i) => [
      { boss: `B${i}`, tryb: 'NORMAL' as const, zaliczone: i < norm },
      { boss: `B${i}`, tryb: 'HARD' as const, zaliczone: i < hard },
    ]).flat()

  it('liczy zaliczone i procent (reużywa procentUkonczenia)', () => {
    const p = podsumujMarki(marki(3, 1, 4), 4)
    expect(p.normalZaliczone).toBe(3)
    expect(p.hardZaliczone).toBe(1)
    expect(p.wszystkieMarki).toBe(8)
    expect(p.procent).toBe(50) // 4 / 8
    expect(p.deadGod).toBe(false)
  })

  it('deadGod = true, gdy wszystkie marki zaliczone', () => {
    const p = podsumujMarki(marki(3, 3, 3), 3)
    expect(p.procent).toBe(100)
    expect(p.deadGod).toBe(true)
  })

  it('0 bossów → 0% i brak Dead God (bez dzielenia przez zero)', () => {
    const p = podsumujMarki([], 0)
    expect(p.wszystkieMarki).toBe(0)
    expect(p.procent).toBe(0)
    expect(p.deadGod).toBe(false)
  })
})

describe('klasaRzadkosci — klasyfikacja achievementów', () => {
  it('<5% → LEGENDARNY', () => {
    expect(klasaRzadkosci(1.2)).toBe('LEGENDARNY')
  })
  it('5–20% → RZADKI', () => {
    expect(klasaRzadkosci(12)).toBe('RZADKI')
  })
  it('≥20% → POSPOLITY', () => {
    expect(klasaRzadkosci(50)).toBe('POSPOLITY')
  })
  it('brak danych (null) → POSPOLITY', () => {
    expect(klasaRzadkosci(null)).toBe('POSPOLITY')
  })
})

describe('policzStaty', () => {
  const isaac: StatyBazowe = {
    damage: 3.5,
    damageMult: 1,
    tears: 2.73,
    speed: 1,
    range: 6.5,
    shotSpeed: 1,
    luck: 0,
  }

  it('bez itemów zwraca staty postaci (z jej mnożnikiem obrażeń)', () => {
    expect(policzStaty(isaac, []).damage).toBe(3.5)
    // Judas: ×1.35 do obrażeń
    expect(policzStaty({ ...isaac, damageMult: 1.35 }, []).damage).toBe(4.73)
  })

  it('sumuje płaskie dodatki', () => {
    const sadOnion = { plaskie: { tears: 0.7 } }
    expect(policzStaty(isaac, [sadOnion, sadOnion]).tears).toBe(4.13)
  })

  it('nakłada mnożniki PO dodatkach', () => {
    // Cricket's Head: +0.5 damage, ×1.5 → (3.5 + 0.5) × 1.5 = 6
    const cricket = { plaskie: { damage: 0.5 }, mnozniki: { damage: 1.5 } }
    expect(policzStaty(isaac, [cricket]).damage).toBe(6)
  })

  it('mnożnik postaci łączy się z mnożnikiem itemu', () => {
    const cricket = { plaskie: { damage: 0.5 }, mnozniki: { damage: 1.5 } }
    // Judas: (3.5 + 0.5) × 1.5 × 1.35 = 8.1
    expect(policzStaty({ ...isaac, damageMult: 1.35 }, [cricket]).damage).toBe(8.1)
  })

  it('przycina do limitów gry (speed maks. 2.0)', () => {
    expect(policzStaty(isaac, [{ plaskie: { speed: 50 } }]).speed).toBe(2)
    expect(policzStaty(isaac, [{ plaskie: { speed: -50 } }]).speed).toBe(0.1)
  })
})
