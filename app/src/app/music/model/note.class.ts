import { octaveNotes } from '../utils/music-theory.utils'

export class Note {
  public readonly frequency: number
  public readonly octave
  public readonly octaveIndex
  public readonly name
  public readonly modifier
  public readonly fullName

  constructor(public readonly index: number) {
    this.frequency = Math.pow(2, (index - 69) / 12) * 440
    this.octave = Math.floor(index / 12)
    this.octaveIndex = this.index % 12
    const octaveNote = octaveNotes[this.octaveIndex]
    this.name = octaveNote.name
    this.modifier = octaveNote.modifier
    this.fullName = `${this.name}${this.modifier}${this.octave}`
  }
}
