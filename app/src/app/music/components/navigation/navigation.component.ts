import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSidenav } from '@angular/material/sidenav'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { map } from 'rxjs'
import { MusicSchoolAuthService } from '../../services/music-school-auth.service'
import { PitchTrainerConfigComponent } from '../pitch-trainer/pitch-trainer-config/pitch-trainer-config.component'

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    PitchTrainerConfigComponent,
    RouterModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Input()
  sidenav!: MatSidenav

  constructor(
    private readonly musicSchoolAuth: MusicSchoolAuthService,
    private readonly route: ActivatedRoute,
  ) {}
  readonly examType$ = this.route.url.pipe(
    map((url) => {
      return url[1].path.split('-')[1]
    }),
  )

  isAuthenticated$ = this.musicSchoolAuth.isAuthenticated$
}
