import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { PitchTrainerHeaderComponent } from '../pitch-trainer-header/pitch-trainer-header.component'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [AsyncPipe, PitchTrainerHeaderComponent],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent {
  pitchDetectionEnabled$: Observable<boolean>
  pitch$: Observable<number | null>

  constructor(private readonly pitchDetectionService: PitchDetectionService) {
    this.pitchDetectionEnabled$ = pitchDetectionService.enabled$
    this.pitch$ = pitchDetectionService.pitch$
  }
}
