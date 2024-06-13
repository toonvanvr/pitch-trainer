import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Subscription } from 'rxjs'
import { MusicSchoolAuthService } from '../../services/music-school-auth.service'

@Component({
  selector: 'app-music-school-auth',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './music-school-auth.component.html',
  styleUrl: './music-school-auth.component.scss',
})
export class MusicSchoolAuthComponent implements OnDestroy, OnInit {
  subscriptions = new Subscription()

  readonly password = new FormControl('')

  constructor(private readonly musicSchoolAuth: MusicSchoolAuthService) {}

  ngOnInit(): void {
    this.password.setValue(
      window.localStorage.getItem('music-school-auth') ?? '',
    )

    this.subscriptions.add(
      this.password.valueChanges.subscribe((value) => {
        if (value !== null) {
          this.musicSchoolAuth.authenticate(value)
        }
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.subscriptions = new Subscription()
  }
}
