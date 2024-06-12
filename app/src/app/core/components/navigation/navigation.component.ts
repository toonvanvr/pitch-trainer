import { AsyncPipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { Observable } from 'rxjs'
import { PitchDetectionService } from '../../../music/services/pitch-detection.service'

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatCardModule,
    MatSlideToggle,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  pitchDetectionEnabled$: Observable<boolean>

  constructor(private readonly pitchDetectionService: PitchDetectionService) {
    this.pitchDetectionEnabled$ = pitchDetectionService.isEnabled$
  }

  togglePitchDetection(value: boolean): void {
    this.pitchDetectionService.togglePitchDetection(value)
  }
}
