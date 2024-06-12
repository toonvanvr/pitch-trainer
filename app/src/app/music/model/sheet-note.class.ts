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
}

export class SheetNote {
  public readonly masterBarTickLookup
  public readonly beatTickLookup
  public readonly beatTickLookupItem
  public readonly alphatabNote

  public readonly note

  public readonly start
  public readonly stop

  constructor({
    masterBarTickLookup,
    beatTickLookup,
    beatTickLookupItem,
    note,
    beat,
  }: SheetNoteOptions) {
    this.masterBarTickLookup = masterBarTickLookup
    this.beatTickLookup = beatTickLookup
    this.beatTickLookupItem = beatTickLookupItem
    this.alphatabNote = note

    this.note = notesByIndex[note.index]

    this.start = beatTickLookupItem.playbackStart
    this.stop = beat.playbackDuration * note.durationPercent
  }
}
