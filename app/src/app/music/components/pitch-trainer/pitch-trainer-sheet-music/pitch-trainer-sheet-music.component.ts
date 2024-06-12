import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { PitchDetectionService } from '../../../services/pitch-detection.service'
import { SheetMusicService } from '../../../services/sheet-music.service'
import { masterBarBeats } from '../../../utils/alphatab.utils'
import { noteIndexFrequency } from '../../../utils/music-theory.utils'

@Component({
  selector: 'app-pitch-trainer-sheet-music',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pitch-trainer-sheet-music.component.html',
  styleUrl: './pitch-trainer-sheet-music.component.scss',
})
export class PitchTrainerSheetMusicComponent {
  constructor(
    private readonly sheetMusic: SheetMusicService,
    private readonly pitchDetection: PitchDetectionService,
  ) {}

  ngOnInit() {
    const container = document.getElementById('sheet-music')
    if (container) {
      container.append(this.sheetMusic.container)
    } else {
      throw new Error('Element #sheet-music is required for this app to work')
    }
    this.sheetMusic.alphaTab.updateSettings()
    const examFileUrl = new URL('/scores/examen-zang.tex', window.location.href)
    this.sheetMusic.loadFile(examFileUrl)
    this.sheetMusic.alphaTab.updateSettings()
    this.sheetMusic.alphaTab.render()
  }

  playerReady$ = this.sheetMusic.playerReady$
  rendered$ = this.sheetMusic.rendered$
  score$ = this.sheetMusic.score$
  soundFontLoadStatus$ = this.sheetMusic.soundFontLoadStatus$
  tickCache$ = this.sheetMusic.tickCache$
  extrema$ = this.sheetMusic.extrema$
  sounds$ = this.sheetMusic.sheetNotes
  pitch$ = this.pitchDetection.pitch$

  masterBarBeats = masterBarBeats
  noteIndexFrequencies = noteIndexFrequency
}
