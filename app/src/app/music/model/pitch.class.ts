import { fractionalIndexFor, notesByIndex } from '../utils/music-theory.utils'

export class Pitch {
  public readonly index
  public readonly note
  public readonly cents

  constructor(public readonly frequency: number) {
    this.index = fractionalIndexFor(frequency)
    const noteIndex = Math.round(this.index)
    this.note = notesByIndex[noteIndex]
    this.cents = Math.floor((this.index - noteIndex) * 100)
  }
}
