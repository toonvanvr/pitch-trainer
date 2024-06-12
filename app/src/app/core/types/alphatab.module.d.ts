import { AlphaTabApi, Settings } from '@coderline/alphatab'

// This library doesn't properly export its types, so we need to derive them

export type AlphaTabApiOptions = Partial<
  Omit<Settings, file | core | display | importer | notation | player> & {
    file?: string
    core?: Partial<Settings['core']>
    display?: Partial<Settings['display']>
    importer?: Partial<Settings['importer']>
    notation?: Partial<Settings['notation']>
    player?: Partial<Settings['player']>
  }
>

export type Score = Exclude<AlphaTabApi['score'], null>
export type MidiTickLookup = Exclude<AlphaTabApi['tickCache'], null>
export type MasterBarTickLookup = MidiTickLookup['masterBars'][number]
export type BeatTickLookup = Exclude<MasterBarTickLookup['firstBeat'], null>
export type BeatTickLookupItem = BeatTickLookup['highlightedBeats'][number]
export type Beat = BeatTickLookup['highlightedBeats'][number]['beat']
export type AlphaTabNote = Beat['notes'][number]
export type ActiveBeatsChangedEvent = Parameters<
  Parameters<AlphaTabApi['activeBeatsChanged']['on']>[0]
>[0]
export type PositionChangedEventArgs = Parameters<
  Parameters<AlphaTabApi['playerPositionChanged']['on']>[0]
>[0]
