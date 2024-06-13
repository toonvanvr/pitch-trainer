import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { SheetMusicService } from '../../../services/sheet-music.service'

@Component({
  selector: 'app-pitch-trainer-sheet-music',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pitch-trainer-sheet-music.component.html',
  styleUrl: './pitch-trainer-sheet-music.component.scss',
})
export class PitchTrainerSheetMusicComponent implements OnInit, OnDestroy {
  constructor(private readonly sheetMusic: SheetMusicService) {}

  ngOnInit() {
    const container = document.getElementById('sheet-music')
    if (container) {
      container.append(this.sheetMusic.container)
    } else {
      throw new Error('Element #sheet-music is required for this app to work')
    }
    this.sheetMusic.allowRender$.next(true)
  }

  ngOnDestroy() {
    this.sheetMusic.allowRender$.next(false)
  }
}
