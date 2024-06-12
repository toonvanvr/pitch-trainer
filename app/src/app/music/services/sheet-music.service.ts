import { Injectable } from '@angular/core'
import { AlphaTabApi, ProgressEventArgs } from '@coderline/alphatab'
import {
  Subject,
  Subscription,
  distinctUntilChanged,
  first,
  fromEventPattern,
  map,
  merge,
  of,
  shareReplay,
} from 'rxjs'
import {
  ActiveBeatsChangedEvent,
  AlphaTabApiOptions,
  PositionChangedEventArgs,
  Score,
} from '../../core/types/alphatab.module'
import { SheetNote } from '../model/sheet-note.class'
import { masterBarBeats } from '../utils/alphatab.utils'

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
  public readonly sheetNotes$
  public readonly playerReady$
  public readonly rendered$
  public readonly score$
  public readonly soundFontLoadStatus$
  public readonly tickCache$
  public readonly isPlaying$
  public readonly activeBeats$
  public readonly tickPosition$

  constructor() {
    this.alphaTab = new AlphaTabApi(this.container, {
      core: { fontDirectory: '/assets/alphatab/font/' },
      player: {
        enablePlayer: true,
        soundFont: '/assets/alphatab/soundfont/sonivox.sf2',
        outputMode: 1, // legacy mode
      },
    } satisfies AlphaTabApiOptions)
    // @ts-ignore
    globalThis.alphatab = this.alphaTab

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
    ).pipe(shareReplay(1))

    this.playerReady$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(false)),
      fromEventPattern(
        (handler) => this.alphaTab?.playerReady.on(handler),
        (handler) => this.alphaTab?.playerReady.off(handler),
        () => true,
      ),
    ).pipe(distinctUntilChanged(), shareReplay(1))

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
    ).pipe(distinctUntilChanged(), shareReplay(1))

    this.score$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(false as const)),
      fromEventPattern(
        (handler) => this.alphaTab?.scoreLoaded.on(handler),
        (handler) => this.alphaTab?.scoreLoaded.off(handler),
        () => this.alphaTab.score as Score,
      ),
    ).pipe(distinctUntilChanged(), shareReplay(1))

    this.tickCache$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.source$.pipe(() => of(null)),
      this.playerReady$.pipe(map(() => this.alphaTab.tickCache)),
    ).pipe(distinctUntilChanged(), shareReplay(1))

    this.isPlaying$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.playerReady$.pipe(() => of(0)),
      fromEventPattern(
        (handler) => this.alphaTab?.playerStateChanged.on(handler),
        (handler) => this.alphaTab?.playerStateChanged.off(handler),
        () => (this.alphaTab.playerState === 1 ? true : false),
      ),
    ).pipe(shareReplay(1))

    this.activeBeats$ = merge(
      this.initializing$.pipe(() => of(null)),
      this.playerReady$.pipe(() => of(null)),
      fromEventPattern(
        (handler) => this.alphaTab?.activeBeatsChanged.on(handler),
        (handler) => this.alphaTab?.activeBeatsChanged.off(handler),
        (e: ActiveBeatsChangedEvent) => e.activeBeats,
      ),
    ).pipe(shareReplay(1))

    this.tickPosition$ = merge(
      this.initializing$.pipe(() => of(null)),
      fromEventPattern<PositionChangedEventArgs>(
        (handler) => this.alphaTab?.playerPositionChanged.on(handler),
        (handler) => this.alphaTab?.playerPositionChanged.off(handler),
      ),
    ).pipe(shareReplay(1))

    this.sheetNotes$ = this.tickCache$
      .pipe(
        map((cache) => {
          if (!cache) {
            return null
          }

          const sheetNotes: SheetNote[] = []
          for (const masterBarTickLookup of cache.masterBars) {
            for (const beatTickLookup of masterBarBeats(masterBarTickLookup)) {
              for (const beatTickLookupItem of beatTickLookup.highlightedBeats) {
                const beat = beatTickLookupItem.beat
                for (const note of beat.notes) {
                  sheetNotes.push(
                    new SheetNote({
                      note,
                      masterBarTickLookup,
                      beatTickLookup,
                      beatTickLookupItem,
                      beat,
                    }),
                  )
                }
              }
            }
          }

          return sheetNotes
        }),
      )
      .pipe(shareReplay(1))

    this.extrema$ = this.sheetNotes$.pipe(
      map((sheetNotes) => {
        if (!sheetNotes || !sheetNotes.length) {
          return null
        }

        let min = sheetNotes[0]
        let max = sheetNotes[0]
        for (const sheetNote of sheetNotes.slice(1)) {
          if (sheetNote.note.index < min.note.index) {
            min = sheetNote
          } else if (sheetNote.note.index > max.note.index) {
            max = sheetNote
          }
        }

        return { min, max }
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
    // this.alphaTab.resize
    // this.alphaTab.settingsUpdated

    this.subscriptions.add(
      this.source$.subscribe((arrayBuffer) => {
        this.alphaTab?.load(arrayBuffer)
      }),
    )
  }

  playPause() {
    this.alphaTab.playPause()
  }

  seekToStart() {
    this.alphaTab.tickPosition = 0
  }

  seekToEnd() {
    this.sheetNotes$.pipe(first()).forEach((sheetNotes) => {
      if (sheetNotes) {
        const lastNote = sheetNotes[sheetNotes.length - 1]
        if (lastNote) {
          this.alphaTab.tickPosition = lastNote.start
        }
      }
    })
  }

  seekForward() {
    const tickCache = this.alphaTab.tickCache
    if (!tickCache) {
      return
    }

    const result = tickCache.findBeat(new Set([0]), this.alphaTab.tickPosition)
    if (result) {
      const nextMasterBar = result.masterBar.nextMasterBar
      if (nextMasterBar) {
        this.alphaTab.tickPosition = nextMasterBar.start
      }
    }
  }

  seekBackward() {
    const tickCache = this.alphaTab.tickCache
    if (!tickCache) {
      return
    }

    const result = tickCache.findBeat(new Set([0]), this.alphaTab.tickPosition)
    if (result) {
      const previousMasterBar = result.masterBar.previousMasterBar
      if (previousMasterBar) {
        this.alphaTab.tickPosition = previousMasterBar.start
      }
    }
  }
}
