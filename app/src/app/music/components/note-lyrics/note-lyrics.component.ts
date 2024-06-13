import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { map } from 'rxjs'
import { SheetMusicService } from '../../services/sheet-music.service'

@Component({
  selector: 'app-note-lyrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-lyrics.component.html',
  styleUrl: './note-lyrics.component.scss',
})
export class NoteLyricsComponent {
  readonly history$ = this.sheetMusic.sheetNoteHistory$

  constructor(private readonly sheetMusic: SheetMusicService) {}

  readonly currentNotes$ = this.sheetMusic.sheetNoteHistory$.pipe(
    map((history) => {
      if (!history) {
        return []
      } else {
        return history.current
      }
    }),
  )

  readonly previousNotes$ = this.history$.pipe(
    map((history) => {
      if (!history) {
        return []
      } else {
        return history.previous.slice(-3)
      }
    }),
  )

  readonly upcomingNotes$ = this.history$.pipe(
    map((history) => {
      if (!history) {
        return []
      } else {
        return history.upcoming.slice(0, 3)
      }
    }),
  )
}
