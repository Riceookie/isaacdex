// Generuje public/tboi/ui/paper-plane.svg — pixel-artowy papierowy samolot na przycisk
// „wyślij" w czacie.
//
// Dlaczego rysowany, a nie wzięty z gry: w The Binding of Isaac NIE MA papierowego samolotu.
// Najbliższe itemy (Mysterious Paper, A Missing Page) to zmięte kartki — czytelne jako
// „papier", ale nie jako „wyślij". Zamiast udawać, że pasują, rysujemy ikonę w tej samej
// konwencji: 18x18 pikseli, twarda krawędź, paleta kartki z polaroidu profilu.
//
// Kształt liczony z geometrii, nie klepany piksel po pikselu — dzięki temu da się go
// poprawić (wcięcie ogona, kąt skrzydła) bez przerysowywania całości.
//
// Użycie: node scripts/gen-paper-plane.mjs public/tboi/ui/paper-plane.svg

import { writeFileSync } from 'node:fs'

const N = 18
// Sylwetka papierowego samolotu lecącego w prawo. Wcięcie w ogonie (punkt „zagięcie")
// jest tym, co odróżnia samolot od zwykłego trójkąta.
const DZIOB = [15.5, 8]
const OGON_GORA = [0.5, 1]
const ZAGIECIE = [6.5, 8]
const OGON_DOL = [0.5, 15]
const KSZTALT = [DZIOB, OGON_GORA, ZAGIECIE, OGON_DOL]

const wSrodku = ([x, y], poly) => {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

// 1) wypełnienie: górne skrzydło jaśniejsze, dolne w cieniu (linia zagięcia = y 8)
const siatka = Array.from({ length: N }, () => Array(N).fill('.'))
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (wSrodku([x + 0.5, y + 0.5], KSZTALT)) siatka[y][x] = y + 0.5 < 9 ? 'L' : 'D'
  }
}

// 2) kontur przez DYLATACJĘ — obrys DOKŁADAMY wokół sylwetki, zamiast zjadać nim kartkę.
// Wariant „zjadający" przy 16 px zostawiał z papieru dwa piksele i ikona robiła się czarna.
const kopia = siatka.map((r) => [...r])
const kartka = (x, y) => x >= 0 && y >= 0 && x < N && y < N && kopia[y][x] !== '.'
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    if (kopia[y][x] !== '.') continue
    if (kartka(x - 1, y) || kartka(x + 1, y) || kartka(x, y - 1) || kartka(x, y + 1))
      siatka[y][x] = 'O'
  }
}
// 3) linia zagięcia — cień tuż pod nią czyta się jako złożony papier
for (let x = 0; x < N; x++) if (siatka[9][x] === 'D') siatka[9][x] = 'F'

const KOLOR = { O: '#2a2018', L: '#f7f0dd', D: '#c9b78f', F: '#a9946a' }

const rects = []
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const c = siatka[y][x]
    // +1: sylwetka wychodzi z rasteryzacji przyklejona do góry, a ikona ma stać w środku pola
    if (c !== '.')
      rects.push(`<rect x="${x}" y="${y + 1}" width="1" height="1" fill="${KOLOR[c]}"/>`)
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" shape-rendering="crispEdges">
${rects.join('\n')}
</svg>
`
writeFileSync(process.argv[2], svg)
console.log(siatka.map((r) => r.join('')).join('\n'))
console.log('\npikseli:', rects.length)
