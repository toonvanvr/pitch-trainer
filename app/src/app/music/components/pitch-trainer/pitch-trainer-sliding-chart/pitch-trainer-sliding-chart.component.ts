import { Component, OnDestroy } from '@angular/core'
import { Line, Rect, SVG } from '@svgdotjs/svg.js'
import { Subscription, combineLatest, map } from 'rxjs'
import { PitchDetectionService } from '../../../services/pitch-detection.service'
import { SheetMusicService } from '../../../services/sheet-music.service'
import { noteColor } from '../../../utils/music-theory.utils'

@Component({
  selector: 'app-pitch-trainer-sliding-chart',
  standalone: true,
  imports: [],
  templateUrl: './pitch-trainer-sliding-chart.component.html',
  styleUrl: './pitch-trainer-sliding-chart.component.scss',
})
export class PitchTrainerSlidingChartComponent implements OnDestroy {
  subscriptions = new Subscription()

  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
  ) {
    this.subscriptions.add(
      this.sheetMusic.tickPosition$.subscribe((tick) => {}),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.subscriptions = new Subscription()
  }

  pitch$ = this.pitchDetection.pitch$

  svgData$ = combineLatest({
    notes: this.sheetMusic.playedNotes$,
    extrema: this.sheetMusic.extrema$,
  }).pipe(
    map(({ notes, extrema }) => {
      if (!notes || !extrema) {
        return null
      }

      const buffer = 0
      const minIndex = Math.max(0, extrema.minNoteIndex - buffer)
      const maxIndex = Math.min(127, extrema.maxNoteIndex + buffer)
      const range = maxIndex - minIndex + 1
      const end = notes[notes.length - 1].end

      const scaleY = 10
      const totalHeight = range * scaleY
      const totalWidth = end
      const svg = SVG().size(totalWidth, totalHeight)
      for (let i = 0; i < maxIndex - minIndex + 2; i++) {
        svg
          .line(0, i * scaleY, totalWidth, i * scaleY)
          .stroke({ color: '#000', width: 1 })
      }
      for (let x = 0; x < totalWidth; x += 1000) {
        svg.line(x, 0, x, totalHeight).stroke({ color: '#000', width: 1 })
      }

      const tickLine = svg
        .line(20, 0, 20, totalHeight)
        .stroke({ color: '#f00', width: 1 })
        .addClass('tick-line')
      // svg.add(tickLine)

      const noteBars: Rect[] = []
      for (const { noteIndex, start, end, octave } of notes) {
        const width = end - start
        const height = scaleY
        const x = start
        const y = (maxIndex - noteIndex) * scaleY

        const noteBar = svg
          .rect(width, height)
          .move(x, y)
          .fill(noteColor(noteIndex, octave))
          .stroke('#0f0')
        noteBars.push(noteBar)
        // svg.add(noteBar)
      }

      return { svg, noteBars, tickLine }
    }),
  )

  tickLine: Line | null = null
  raceChart: HTMLElement | null = null
  ngAfterViewInit() {
    this.subscriptions.add(
      this.svgData$.subscribe((svgData) => {
        if (svgData) {
          const raceChart = document.getElementById('race-chart')
          if (raceChart) {
            svgData.svg.addTo(raceChart)
            this.tickLine = svgData.tickLine
            this.raceChart = raceChart
          } else {
            throw new Error(
              'Element #race-chart is required for this app to work',
            )
          }
        }
      }),
    )

    this.subscriptions.add(
      this.sheetMusic.tickPosition$.subscribe((tick) => {
        if (this.tickLine && this.raceChart) {
          this.tickLine.move(tick?.currentTick ?? 0, 0)
          this.raceChart.scrollTo((tick?.currentTick ?? 0) - 100, 0)
        }
      }),
    )

    this.subscriptions.add(
      combineLatest({
        pitch: this.pitch$,
        svgData: this.svgData$,
        tickPosition: this.sheetMusic.tickPosition$,
      }).subscribe(({ pitch, svgData, tickPosition }) => {
        // if (svgData && tickPosition) {
        //   const { svg, noteBars } = svgData
        //   const { noteIndex, octave } = pitch
        //   const noteBar = noteBars.find(
        //     (noteBar) => noteBar.y() === (127 - noteIndex) * 10,
        //   )
        //   if (noteBar) {
        //     noteBar.fill(noteColor(noteIndex, octave))
        //   }
        //   svg
        //     .circle(5)
        //     .move(tickPosition.currentTick, (127 - noteIndex) * 10)
        //     .fill('#f00')
        // }
      }),
    )
  }
}
