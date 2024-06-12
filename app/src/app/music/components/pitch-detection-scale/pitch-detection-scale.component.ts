import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { map } from 'rxjs'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { SheetMusicService } from '../../services/sheet-music.service'
import { allNoteIndices, notesByIndex } from '../../utils/music-theory.utils'

@Component({
  selector: 'app-pitch-detection-scale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pitch-detection-scale.component.html',
  styleUrl: './pitch-detection-scale.component.scss',
})
export class PitchDetectionScaleComponent {
  static readonly buffer = 6

  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
  ) {}

  readonly scale$ = this.sheetMusic.extrema$.pipe(
    map((extrema) => {
      if (!extrema) {
        return allNoteIndices.map((index) => notesByIndex[index]).reverse()
      } else {
        const buffer = PitchDetectionScaleComponent.buffer
        const minIndex = Math.max(0, extrema.min.note.index - buffer)
        const maxIndex = Math.min(127, extrema.max.note.index + buffer)
        const indexRange = maxIndex - minIndex + 1
        return Array.from({ length: indexRange }).map(
          (_, i) => notesByIndex[minIndex + i],
        )
      }
    }),
  )

  readonly pitch$ = this.pitchDetection.pitch$
}
