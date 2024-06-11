export const noteIndexFrequencies: number[] = Array.from({ length: 128 }).map(
  (_, i) => Math.pow(2, (i - 69) / 12) * 440,
)

export function noteIndexFor(frequency: number): number {
  return 12 * Math.log2(frequency / 440) + 69
}

const noteNames = [
  'do',
  'do#',
  're',
  're#',
  'mi',
  'fa',
  'fa#',
  'sol',
  'sol#',
  'la',
  'la#',
  'si',
]

export const noteIndexNames = noteIndexFrequencies.map((f, i) => {
  const name = noteNames[i % 12]
  const octave = Math.floor(i / 12)
  return `${name}${octave}`
})
