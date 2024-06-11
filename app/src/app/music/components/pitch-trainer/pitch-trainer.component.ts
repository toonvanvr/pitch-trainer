import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { PitchTrainerHeaderComponent } from '../pitch-trainer-header/pitch-trainer-header.component'
import { PitchTrainerSheetMusicComponent } from '../pitch-trainer-sheet-music/pitch-trainer-sheet-music.component'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [
    AsyncPipe,
    PitchTrainerHeaderComponent,
    PitchTrainerSheetMusicComponent,
  ],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent {
  pitch$: Observable<number | null>

  constructor(private readonly pitchDetectionService: PitchDetectionService) {
    this.pitch$ = pitchDetectionService.pitch$
  }
}
