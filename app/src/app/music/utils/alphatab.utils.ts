import {
  BeatTickLookup,
  MasterBarTickLookup,
} from '../../core/types/alphatab.module'

export function masterBarBeats(
  masterBarTickLookup: MasterBarTickLookup,
): BeatTickLookup[] {
  if (
    masterBarTickLookup.firstBeat === null ||
    masterBarTickLookup.lastBeat === null
  ) {
    return []
  }

  const beats = [] as BeatTickLookup[]
  let currentBeat: BeatTickLookup | null = masterBarTickLookup.firstBeat
  while (currentBeat !== null) {
    beats.push(currentBeat)
    if (currentBeat === masterBarTickLookup.lastBeat) {
      break
    }
    currentBeat = currentBeat.nextBeat
  }

  return beats
}
