import { Component } from '@angular/core'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-pitch-trainer-header',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './pitch-trainer-header.component.html',
  styleUrl: './pitch-trainer-header.component.scss',
})
export class PitchTrainerHeaderComponent {}
