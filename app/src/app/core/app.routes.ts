import { Routes } from '@angular/router'
import { MusicSchoolAuthComponent } from '../music/components/music-school-auth/music-school-auth.component'
import { PitchTrainerComponent } from '../music/components/pitch-trainer/pitch-trainer.component'
import { musicSchoolGuard } from '../music/guards/music-school.guard'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pitch-trainer/examen-zang',
  },
  {
    path: 'beveiliging',
    component: MusicSchoolAuthComponent,
  },
  {
    path: 'pitch-trainer/:source',
    canActivate: [musicSchoolGuard],
    component: PitchTrainerComponent,
  },
]
