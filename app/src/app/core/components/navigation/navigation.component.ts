import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { MatSliderModule } from '@angular/material/slider'
import { map } from 'rxjs'
import { PitchDetectionService } from '../../../music/services/pitch-detection.service'
import { SheetMusicService } from '../../../music/services/sheet-music.service'
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatSlideToggle,
    MatSliderModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  readonly pitchDetectionEnabled$ = this.pitchDetection.isEnabled$
  readonly masterVolume$ = this.sheetMusic.masterVolume$.pipe(
    map((v) => v * 100),
  )
  readonly metronomeVolume$ = this.sheetMusic.metronomeVolume$.pipe(
    map((v) => v * 100),
  )
  readonly transpose$ = this.sheetMusic.transpose$
  readonly playbackSpeed$ = this.sheetMusic.playbackSpeed$.pipe(
    map((v) => v * 100),
  )
  readonly playbackTempo$ = this.sheetMusic.playbackTempo$.pipe(
    map((v) => (v ? Math.round(v) : null)),
  )

  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
  ) {}

  togglePitchDetection(value: boolean): void {
    this.pitchDetection.togglePitchDetection(value)
  }

  setMasterVolume(percentage: number): void {
    this.sheetMusic.masterVolume$.next(percentage / 100)
  }

  setMetronomeVolume(percentage: number): void {
    this.sheetMusic.metronomeVolume$.next(percentage / 100)
    this.sheetMusic.alphaTab.metronomeVolume = percentage / 100
  }

  setTransposition(transpose: number): void {
    this.sheetMusic.transpose$.next(transpose)
  }

  setPlaybackSpeed(speed: number): void {
    this.sheetMusic.playbackSpeed$.next(speed / 100)
  }
}
