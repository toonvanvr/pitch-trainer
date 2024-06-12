import { Component, OnDestroy } from '@angular/core'
import { Line, Rect, SVG } from '@svgdotjs/svg.js'
import {
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs'
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
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.subscriptions = new Subscription()
  }

  pitch$ = this.pitchDetection.pitch$

  svgData$ = combineLatest({
    notes: this.sheetMusic.sheetNotes$,
    extrema: this.sheetMusic.extrema$,
    masterBars: this.sheetMusic.masterBars$,
  }).pipe(
    map(({ notes, extrema, masterBars }) => {
      if (!notes || !extrema || !masterBars) {
        return null
      }

      const buffer = 0
      const minIndex = Math.max(0, extrema.min.note.index - buffer)
      const maxIndex = Math.min(127, extrema.max.note.index + buffer)
      const range = maxIndex - minIndex + 1
      const end = notes[notes.length - 1].end

      const scaleY = 10
      const totalHeight = range * scaleY
      const totalWidth = end
      const svg = SVG()
        .size(1000, totalHeight)
        .viewbox(0, 0, totalWidth, totalHeight)
        .attr('preserveAspectRatio', 'none')
      for (let i = 0; i < maxIndex - minIndex + 2; i++) {
        svg
          .line(0, i * scaleY, totalWidth, i * scaleY)
          .stroke({ color: 'rgb(196,196,196)', width: 1 })
      }

      for (const { start } of masterBars) {
        svg
          .line(0, start * scaleY, totalWidth, start * scaleY)
          .stroke({ color: 'rgb(224,224,224)', width: 1 })
      }

      const tickLine = svg
        .line(0, 0, 0, totalHeight)
        .stroke({ color: '#f00', width: 1 })
        .addClass('tick-line')
        .attr({ 'vector-effect': 'non-scaling-stroke' })

      const noteBars: Rect[] = []
      for (const {
        start,
        end,
        note: { index },
      } of notes) {
        const width = end - start
        const height = scaleY
        const x = start
        const y = (maxIndex - index) * scaleY

        const noteBar = svg
          .rect(width, height)
          .radius(scaleY / 2)
          .move(x, y)
          .fill(noteColor(index))
        noteBars.push(noteBar)
      }

      return { svg, noteBars, tickLine }
    }),
    distinctUntilChanged(),
    shareReplay(1),
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
