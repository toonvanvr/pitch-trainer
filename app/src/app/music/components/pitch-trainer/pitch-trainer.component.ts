import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { PitchDetectionScaleComponent } from '../pitch-detection-scale/pitch-detection-scale.component'

import { PitchDetectionService } from '../../services/pitch-detection.service'
import { PitchTrainerHeaderComponent } from './pitch-trainer-header/pitch-trainer-header.component'
import { PitchTrainerSheetMusicComponent } from './pitch-trainer-sheet-music/pitch-trainer-sheet-music.component'
import { PitchTrainerSlidingChartComponent } from './pitch-trainer-sliding-chart/pitch-trainer-sliding-chart.component'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [
    CommonModule,
    PitchDetectionScaleComponent,
    PitchTrainerHeaderComponent,
    PitchTrainerSheetMusicComponent,
    PitchTrainerSlidingChartComponent,
  ],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent {
  constructor(private readonly pitchDetection: PitchDetectionService) {}

  readonly pitchDetectionIsEnabled$ = this.pitchDetection.isEnabled$
}
