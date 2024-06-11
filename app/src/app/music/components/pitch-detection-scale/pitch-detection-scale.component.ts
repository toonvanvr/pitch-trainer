import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { combineLatest, map } from 'rxjs'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { SheetMusicService } from '../../services/sheet-music.service'
import { noteColor, noteIndexNames } from '../../utils/music-theory.utils'

@Component({
  selector: 'app-pitch-detection-scale',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pitch-detection-scale.component.html',
  styleUrl: './pitch-detection-scale.component.scss',
})
export class PitchDetectionScaleComponent {
  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
  ) {}

  readonly scale$ = combineLatest({
    extrema: this.sheetMusic.extrema$,
    pitch: this.pitchDetection.pitch$,
  }).pipe(
    // TODO: this is too much math; handle extrema first and pitch in a separate pipe
    map(({ extrema, pitch }) => {
      if (!extrema) {
        return Array.from({ length: 128 })
          .map((_, i) => {
            return {
              noteIndex: i,
              noteOctave: Math.floor(i / 12),
              noteName: noteIndexNames[i],
              isSinging: pitch?.noteIndex === i,
              cents: pitch?.noteIndex === i ? pitch?.cents : null,
              bgColor: noteColor(i),
            }
          })
          .reverse()
      } else {
        const buffer = 6
        const minIndex = Math.max(0, extrema.minNoteIndex - buffer)
        const maxIndex = Math.min(127, extrema.maxNoteIndex + buffer)
        return Array.from({ length: maxIndex - minIndex + 1 })
          .map((_, i) => {
            const noteIndex = minIndex + i
            return {
              noteIndex,
              noteOctave: Math.floor(noteIndex / 12),
              noteName: noteIndexNames[noteIndex],
              isSinging: pitch?.noteIndex === noteIndex,
              cents: pitch?.noteIndex === noteIndex ? pitch?.cents : null,
              bgColor: noteColor(i),
            }
          })
          .reverse()
      }
    }),
  )

  readonly pitch$ = this.pitchDetection.pitch$
}
