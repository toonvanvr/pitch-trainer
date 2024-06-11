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

export function noteColor(
  noteIndex: number,
  octave: number | null = null,
): string {
  octave ??= Math.floor(noteIndex / 12)
  // hue range centra go from 180 degrees to 300 degrees (lightblue to pink)
  const octaveHueStep = (300 - 180) / 12
  // the note index within the scale has less impact on the coloring
  const noteHueRange = octaveHueStep / 6
  const noteHueStep = noteHueRange / 12
  const innerOctaveIndex = noteIndex % 12

  const hue =
    180 +
    octave * octaveHueStep -
    innerOctaveIndex * noteHueStep -
    noteHueRange / 2

  return `hsla(${hue}, 100%, 50%, 75%)`
}
