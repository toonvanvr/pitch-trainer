import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-pitch-trainer-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './pitch-trainer-header.component.html',
  styleUrl: './pitch-trainer-header.component.scss',
})
export class PitchTrainerHeaderComponent {}
