import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { PitchDetectionScaleComponent } from '../pitch-detection-scale/pitch-detection-scale.component'

import { ActivatedRoute } from '@angular/router'
import { PitchDetectionService } from '../../services/pitch-detection.service'
import { SheetMusicService } from '../../services/sheet-music.service'
import { NavigationComponent } from '../navigation/navigation.component'
import { PitchTrainerHeaderComponent } from './pitch-trainer-header/pitch-trainer-header.component'
import { PitchTrainerSheetMusicComponent } from './pitch-trainer-sheet-music/pitch-trainer-sheet-music.component'
import { PitchTrainerSlidingChartComponent } from './pitch-trainer-sliding-chart/pitch-trainer-sliding-chart.component'

@Component({
  selector: 'app-pitch-trainer',
  standalone: true,
  imports: [
    CommonModule,
    PitchDetectionScaleComponent,
    PitchTrainerHeaderComponent,
    PitchTrainerSheetMusicComponent,
    PitchTrainerSlidingChartComponent,
    NavigationComponent,
  ],
  templateUrl: './pitch-trainer.component.html',
  styleUrl: './pitch-trainer.component.scss',
})
export class PitchTrainerComponent implements OnInit {
  constructor(
    private readonly pitchDetection: PitchDetectionService,
    private readonly sheetMusic: SheetMusicService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let baseName: string
      if ('source' in params) {
        // @ts-ignore
        baseName = params.source
      } else {
        baseName = 'examen-zang'
      }
      const url = new URL(`/scores/${baseName}.tex`, window.location.href)
      this.sheetMusic.loadFile(url)
      this.sheetMusic.needRender$.next(true)
    })
  }

  readonly pitchDetectionIsEnabled$ = this.pitchDetection.isEnabled$
}
