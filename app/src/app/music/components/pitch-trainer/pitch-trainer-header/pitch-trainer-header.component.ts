import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenav } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { SheetMusicService } from '../../../services/sheet-music.service'

@Component({
  selector: 'app-pitch-trainer-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './pitch-trainer-header.component.html',
  styleUrl: './pitch-trainer-header.component.scss',
})
export class PitchTrainerHeaderComponent {
  @Input()
  sidenav!: MatSidenav

  constructor(private readonly sheetMusic: SheetMusicService) {}

  readonly isPlaying$ = this.sheetMusic.isPlaying$

  readonly playPause = this.sheetMusic.playPause.bind(this.sheetMusic)
  readonly seekToStart = this.sheetMusic.seekToStart.bind(this.sheetMusic)
  readonly seekToEnd = this.sheetMusic.seekToEnd.bind(this.sheetMusic)
  readonly seekForward = this.sheetMusic.seekForward.bind(this.sheetMusic)
  readonly seekBackward = this.sheetMusic.seekBackward.bind(this.sheetMusic)
}
