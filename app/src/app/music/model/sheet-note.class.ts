import {
  AlphaTabNote,
  BeatTickLookup,
  BeatTickLookupItem,
  MasterBarTickLookup,
} from '../../core/types/alphatab.module'
import { notesByIndex } from '../utils/music-theory.utils'

export interface SheetNoteOptions {
  note: AlphaTabNote
  masterBarTickLookup: MasterBarTickLookup
  beatTickLookup: BeatTickLookup
  beatTickLookupItem: BeatTickLookupItem
  transposition: number
}

export class SheetNote {
  public readonly masterBar
  public readonly masterBarTickLookup
  public readonly beatTickLookup
  public readonly beatTickLookupItem
  public readonly beat
  public readonly alphatabNote
  public readonly note

  public readonly start
  public readonly end
  public readonly transposition

  public readonly singName

  constructor({
    masterBarTickLookup,
    beatTickLookup,
    beatTickLookupItem,
    note,
    transposition,
  }: SheetNoteOptions) {
    this.masterBarTickLookup = masterBarTickLookup
    this.masterBar = masterBarTickLookup.masterBar
    this.beatTickLookup = beatTickLookup
    this.beatTickLookupItem = beatTickLookupItem
    this.beat = beatTickLookupItem.beat
    this.alphatabNote = note

    this.start = this.beat.absolutePlaybackStart
    this.end = this.start + this.beat.playbackDuration * note.durationPercent
    this.transposition = transposition

    this.note = notesByIndex[note.displayValue + transposition]
    if (!this.note) {
      throw new Error(
        `Note not found for index ${note.displayValue} after transposition of ${transposition} on note ${note.index}`,
      )
    }

    // TODO: derive this mathematically from all key signatures
    switch (this.masterBar.keySignature) {
      case -1:
        // mol op si => la# wordt si, si# wordt do?
        if (this.note.name === 'la' && this.note.modifier === '#') {
          this.singName = 'si'
        } else {
          this.singName = this.note.name
        }
        break
      default:
        this.singName = this.note.name
        break
    }
  }
}
