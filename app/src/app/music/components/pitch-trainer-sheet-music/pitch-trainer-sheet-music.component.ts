import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { SheetMusicService } from '../../services/sheet-music.service'
import { masterBarBeats } from '../../utils/alphatab.utils'
import { noteIndexFrequencies } from '../../utils/music-theory.utils'

@Component({
  selector: 'app-pitch-trainer-sheet-music',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pitch-trainer-sheet-music.component.html',
  styleUrl: './pitch-trainer-sheet-music.component.scss',
})
export class PitchTrainerSheetMusicComponent {
  constructor(
    private readonly sheetMusicService: SheetMusicService,
    private readonly pitchDetectionService: PitchDetectionService,
  ) {
    const examFileUrl = new URL('/scores/examen-zang.tex', window.location.href)
    this.sheetMusicService.loadFile(examFileUrl)
  }

  playerReady$ = this.sheetMusicService.playerReady$
  rendered$ = this.sheetMusicService.rendered$
  score$ = this.sheetMusicService.score$
  soundFontLoadStatus$ = this.sheetMusicService.soundFontLoadStatus$
  tickCache$ = this.sheetMusicService.tickCache$
  extrema$ = this.sheetMusicService.extrema$
  sounds$ = this.sheetMusicService.playedNotes$
  pitch$ = this.pitchDetectionService.pitch$

  masterBarBeats = masterBarBeats
  noteIndexFrequencies = noteIndexFrequencies
}
