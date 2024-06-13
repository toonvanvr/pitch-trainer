import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { MatExpansionModule } from '@angular/material/expansion'
import { MusicSchoolAuthService } from '../../services/music-school-auth.service'
import { PitchTrainerConfigComponent } from '../pitch-trainer/pitch-trainer-config/pitch-trainer-config.component'
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, PitchTrainerConfigComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  constructor(private readonly musicSchoolAuth: MusicSchoolAuthService) {}

  isAuthenticated$ = this.musicSchoolAuth.isAuthenticated$
}
