import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { PitchDetectionScaleComponent } from '../pitch-detection-scale/pitch-detection-scale.component'

import { SheetMusicService } from '../../services/sheet-music.service'
import { PitchTrainerHeaderComponent } from './pitch-trainer-header/pitch-trainer-header.component'
import { PitchTrainerSheetMusicComponent } from './pitch-trainer-sheet-music/pitch-trainer-sheet-music.component'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [
    AsyncPipe,
    PitchTrainerHeaderComponent,
    PitchTrainerSheetMusicComponent,
    PitchDetectionScaleComponent,
  ],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent {
  constructor(private readonly sheetMusic: SheetMusicService) {
    const examFileUrl = new URL('/scores/examen-zang.tex', window.location.href)
    this.sheetMusic.loadFile(examFileUrl)
  }
}
