import { Component } from '@angular/core'
import { SVG } from '@svgdotjs/svg.js'
import { combineLatest, map } from 'rxjs'
import { PitchDetectionService } from '../../../services/pitch-detection.service'
import { SheetMusicService } from '../../../services/sheet-music.service'

@Component({
  selector: 'app-pitch-trainer-sliding-chart',
  standalone: true,
  imports: [],
  templateUrl: './pitch-trainer-sliding-chart.component.html',
  styleUrl: './pitch-trainer-sliding-chart.component.scss',
})
export class PitchTrainerSlidingChartComponent {
  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
  ) {}

  pitch$ = this.pitchDetection.pitch$

  svgBase$ = combineLatest({
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

      const svg = SVG().size(end, range * scaleY)
      for (let i = 0; i < maxIndex - minIndex + 2; i++) {
        svg
          .line(0, i * scaleY, end, i * scaleY)
          .stroke({ color: '#000', width: 1 })
      }
      for (let x = 0; x < end; x += 1000) {
        svg.line(x, 0, x, range * scaleY).stroke({ color: '#000', width: 1 })
      }

      for (const note of notes) {
        const { noteIndex } = note

        const width = note.end - note.start
        const height = scaleY
        const x = note.start
        const y = (maxIndex - noteIndex) * scaleY

        svg.add(svg.rect(width, height).move(x, y).fill('#f00').stroke('#0f0'))
        // console.log({ noteIndex, x, y, width, height })
      }

      return svg
      // const noteRange = Array.from({ length: maxIndex - minIndex + 1 })
      //   .map((_, i) => {
      //     const noteIndex = minIndex + i
      //     return {
      //       noteIndex,
      //       bgColor: noteColor(i),
      //     }
      //   })
      //   .reverse()
    }),
  )

  ngAfterViewInit() {
    this.svgBase$.subscribe((svg) => {
      if (svg) {
        svg.addTo('#race-chart')
      }
    })
  }
}
