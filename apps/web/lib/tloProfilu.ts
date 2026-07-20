import { jestTainted, slugPostaci } from '@/lib/chars'

/**
 * Kolor akcentu karty profilu, skojarzony z ulubioną postacią.
 *
 * DECYZJA: tło idzie za POSTACIĄ, nie za procentem ukończenia. Profil ma mówić „to konto
 * Azazela", a nie powtarzać po raz trzeci to samo, co wielki pasek Dead God i metryczka
 * achievementów. Kolor ma też tę zaletę, że działa dla kogoś bez podpiętego Steama —
 * a wersja „im wyższy procent, tym mocniejsze tło" świeciłaby wtedy pustką.
 *
 * Kolory są skojarzeniami z gry (łzy Isaaca, brimstone Azazela, monety Keepera), a nie
 * próbkami z pikseli — chodzi o rozpoznawalność, nie o wierność sprite'a.
 */
const KOLORY: Record<string, string> = {
  isaac: '#7fa8d8', // niebieskie łzy
  magdalene: '#e0708f', // serca
  cain: '#c9a961', // złodziej, worek monet
  judas: '#a83a4a', // czerwona szata
  q: '#6fa8c7', // ??? (Blue Baby)
  eve: '#a1455c', // Whore of Babylon, krew
  samson: '#b04a2a', // berserk
  azazel: '#8b4fa8', // demon, Brimstone
  lazarus: '#c8a24a', // łachmany
  eden: '#8fd0a8', // losowość, pastelowy chaos
  'the-lost': '#dfe6ee', // duch
  lilith: '#7a4fb0', // inkub
  keeper: '#c8a03a', // monety
  apollyon: '#6b6488', // szarańcza, pustka
  'the-forgotten': '#cfd2c8', // kości
  bethany: '#9fb6e8', // soul hearts
  'jacob-esau': '#c98a4a', // brązy bliźniaków
}

/**
 * Hex akcentu albo `null`, gdy postaci nie ma (świadome „Brak" w edytorze) lub nie znamy
 * jej koloru — wtedy karta zostaje taka, jak była, zamiast dostać losowy tint.
 *
 * Splugawione warianty dziedziczą kolor postaci bazowej. Tint jest na tyle delikatny, że
 * osobna, przyciemniona paleta nie byłaby w nim odróżnialna — a „Tainted Azazel" i tak ma
 * być rozpoznawalny jako Azazel.
 */
export function akcentPostaci(nazwa: string | null | undefined): string | null {
  const n = nazwa?.trim()
  if (!n) return null
  const baza = jestTainted(n) ? n.slice('Tainted '.length) : n
  return KOLORY[slugPostaci(baza)] ?? null
}
