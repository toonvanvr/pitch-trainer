import {
  AlphaTabNote,
  Beat,
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
  beat: Beat
  transposition: number
}

export class SheetNote {
  public readonly masterBarTickLookup
  public readonly beatTickLookup
  public readonly beatTickLookupItem
  public readonly beat
  public readonly alphatabNote
  public readonly note

  public readonly start
  public readonly end
  public readonly transposition

  constructor({
    masterBarTickLookup,
    beatTickLookup,
    beatTickLookupItem,
    note,
    beat,
    transposition,
  }: SheetNoteOptions) {
    this.masterBarTickLookup = masterBarTickLookup
    this.beatTickLookup = beatTickLookup
    this.beatTickLookupItem = beatTickLookupItem
    this.beat = beat
    this.alphatabNote = note
    this.note = notesByIndex[note.displayValue + transposition]
    if (!this.note) {
      throw new Error(
        `Note not found for index ${note.displayValue} after transposition of ${transposition} on note ${note.index}`,
      )
    }

    this.start = beat.absolutePlaybackStart
    this.end = this.start + beat.playbackDuration * note.durationPercent
    this.transposition = transposition
  }
}
