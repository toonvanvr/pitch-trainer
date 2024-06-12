import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { map } from 'rxjs'
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
  constructor(private readonly sheetMusic: SheetMusicService) {}

  playPause = this.sheetMusic.playPause.bind(this.sheetMusic)
  seekToStart = this.sheetMusic.seekToStart.bind(this.sheetMusic)
  seekToEnd = this.sheetMusic.seekToEnd.bind(this.sheetMusic)

  readonly isPlaying$ = this.sheetMusic.playerState$.pipe(
    map((state) => state === 1),
  )
}
