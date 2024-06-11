import { Injectable } from '@angular/core'
import { AlphaTabApi, ProgressEventArgs } from '@coderline/alphatab'
import {
  Observable,
  Subject,
  Subscription,
  distinctUntilChanged,
  fromEventPattern,
  map,
  merge,
  of,
} from 'rxjs'
import { noteIndexFrequencies } from '../utils/music-theory.utils'

export type Score = Exclude<AlphaTabApi['score'], null>
export type MidiTickLookup = Exclude<
  SheetMusicService['tickCache$'] extends Observable<infer T> ? T : never,
  null
>
export type MasterBarTickLookup = MidiTickLookup['masterBars'][number]
export type BeatTickLookup = Exclude<MasterBarTickLookup['firstBeat'], null>
export type Beat = BeatTickLookup['highlightedBeats'][number]['beat']
export type Note = Beat['notes'][number]

export interface PlayedNote {
  noteIndex: number
  frequency: number
  start: number
  end: number
  duration: number
}

@Injectable({
  providedIn: 'root',
})
export class SheetMusicService {
  private subscriptions = new Subscription()
  private readonly initializing$ = new Subject<void>()

  public readonly source$ = new Subject<ArrayBuffer>()
  async loadFile(url: URL) {
    const file = await fetch(url)
    const arrayBuffer = await file.arrayBuffer()
    this.source$.next(arrayBuffer)
  }

  public readonly container = document.createElement('div')
  public alphaTab: AlphaTabApi

  public readonly extrema$
  public readonly playedNotes$
  public readonly playerReady$
  public readonly rendered$
  public readonly score$
  public readonly soundFontLoadStatus$
  public readonly tickCache$
  public readonly playerState$

  constructor() {
    this.alphaTab = new AlphaTabApi(this.container, {
      core: { fontDirectory: '/assets/alphatab/font/' },
      player: {
        enablePlayer: true,
        soundFont: '/assets/alphatab/soundfont/sonivox.sf2',
      },
    })

    this.soundFontLoadStatus$ = merge(
      this.initializing$.pipe(() => of({ loaded: false, progress: 0 })),
      fromEventPattern(
        (handler) => this.alphaTab?.soundFontLoad.on(handler),
        (handler) => this.alphaTab?.soundFontLoad.off(handler),
        (event: ProgressEventArgs) => {
          return {
            loaded: event.loaded === event.total,
            progress: event.loaded / event.total,
          }
        },
      ),
      fromEventPattern(
        (handler) => this.alphaTab?.soundFontLoaded.on(handler),
        (handler) => this.alphaTab?.soundFontLoaded.off(handler),
        (event: ProgressEventArgs) => {
          return { loaded: true, progress: 1 }
        },
      ),
    )

    this.playerReady$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(false)),
      fromEventPattern(
        (handler) => this.alphaTab?.playerReady.on(handler),
        (handler) => this.alphaTab?.playerReady.off(handler),
        () => true,
      ),
    )

    this.rendered$ = merge(
      this.initializing$.pipe(() => of(null)),
      fromEventPattern(
        (handler) => this.alphaTab?.renderStarted.on(handler),
        (handler) => this.alphaTab?.renderStarted.off(handler),
        () => false,
      ),
      fromEventPattern(
        (handler) => this.alphaTab?.renderFinished.on(handler),
        (handler) => this.alphaTab?.renderFinished.off(handler),
        () => true,
      ),
    ).pipe(distinctUntilChanged())

    this.score$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(false as const)),
      fromEventPattern(
        (handler) => this.alphaTab?.scoreLoaded.on(handler),
        (handler) => this.alphaTab?.scoreLoaded.off(handler),
        () => this.alphaTab.score as Score,
      ),
    ).pipe(distinctUntilChanged())

    this.tickCache$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(null)),
      this.playerReady$.pipe(map(() => this.alphaTab.tickCache)),
    ).pipe(distinctUntilChanged())

    this.playerState$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.playerReady$.pipe(() => of(0)),
      fromEventPattern(
        (handler) => this.alphaTab?.playerStateChanged.on(handler),
        (handler) => this.alphaTab?.playerStateChanged.off(handler),
        () => this.alphaTab.playerState,
      ),
    )

    this.playedNotes$ = this.score$.pipe(
      map((score) => {
        if (!score) {
          return null
        }

        const playedNotes: PlayedNote[] = []

        for (const track of score.tracks) {
          for (const staff of track.staves) {
            for (const bar of staff.bars) {
              for (const voice of bar.voices) {
                for (const beat of voice.beats) {
                  for (const note of beat.notes) {
                    const duration = beat.displayDuration * note.durationPercent
                    playedNotes.push({
                      noteIndex: note.realValue,
                      frequency: noteIndexFrequencies[note.realValue],
                      start: beat.absoluteDisplayStart,
                      end: beat.absoluteDisplayStart + duration,
                      duration,
                    })
                  }
                }
              }
            }
          }
        }

        return playedNotes
      }),
    )

    this.extrema$ = this.playedNotes$.pipe(
      map((sounds) => {
        if (!sounds) {
          return null
        }

        let minIndex = Infinity
        let maxIndex = -Infinity
        let minNoteIndex
        let maxNoteIndex
        for (const sound of sounds) {
          if (sound.noteIndex < minIndex) {
            minIndex = sound.noteIndex
            minNoteIndex = sound
          }
          if (sound.noteIndex > maxIndex) {
            maxIndex = sound.noteIndex
            maxNoteIndex = sound
          }
        }

        if (!minNoteIndex || !maxNoteIndex) {
          return null
        }

        return {
          minNoteIndex: minIndex,
          maxNoteIndex: maxIndex,
          minNote: minNoteIndex,
          maxNote: maxNoteIndex,
        }
      }),
    )

    // this.alphaTab.beatMouseDown
    // this.alphaTab.beatMouseMove
    // this.alphaTab.beatMouseUp
    // this.alphaTab.midiLoad
    // this.alphaTab.playbackRangeChanged
    // this.alphaTab.playedBeatChanged
    // this.alphaTab.playerFinished
    // this.alphaTab.playerPositionChanged
    // this.alphaTab.playerStateChanged
    // this.alphaTab.resize
    // this.alphaTab.settingsUpdated

    this.subscriptions.add(
      this.source$.subscribe((arrayBuffer) => {
        this.alphaTab?.load(arrayBuffer)
      }),
    )
  }
}
