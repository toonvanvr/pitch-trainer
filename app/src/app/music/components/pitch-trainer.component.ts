import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { PitchDetectionService } from '../services/pitch-detection.service'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent {
  enabled$: BehaviorSubject<boolean>
  pitch$: Observable<number | null>

  constructor(private readonly pitchDetectionService: PitchDetectionService) {
    this.enabled$ = pitchDetectionService.enabled$
    this.pitch$ = pitchDetectionService.pitch$
  }
}
