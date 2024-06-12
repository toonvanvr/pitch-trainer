import { Note } from '../model/note.class'

export const allNoteIndices = Array.from({ length: 128 }).map((_, i) => i)

export function fractionalIndexFor(frequency: number): number {
  return 12 * Math.log2(frequency / 440) + 69
}

export const octaveNotes = [
  { name: 'do', modifier: null },
  { name: 'do', modifier: '#' },
  { name: 're', modifier: null },
  { name: 're', modifier: '#' },
  { name: 'mi', modifier: null },
  { name: 'fa', modifier: null },
  { name: 'fa', modifier: '#' },
  { name: 'sol', modifier: null },
  { name: 'sol', modifier: '#' },
  { name: 'la', modifier: null },
  { name: 'la', modifier: '#' },
  { name: 'si', modifier: null },
]

export const notesByIndex = allNoteIndices.map((index) => new Note(index))

export function noteColor(index: number): string {
  const octave = Math.floor(index / 12)
  // hue range centra go from 180 degrees to 300 degrees (lightblue to pink)
  const octaveHueStep = (300 - 180) / 12
  // the note index within the scale has less impact on the coloring
  const noteHueRange = octaveHueStep / 4
  const noteHueStep = noteHueRange / 12
  const innerOctaveIndex = index % 12

  const hue =
    180 +
    octave * octaveHueStep -
    innerOctaveIndex * noteHueStep -
    noteHueRange / 2

  return `hsla(${hue}, 100%, 50%, 55%)`
}
