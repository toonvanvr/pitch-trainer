import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Subscription, map, pairwise, share } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MusicSchoolAuthService {
  readonly subscriptions = new Subscription()
  isAuthenticated = false

  constructor(private readonly router: Router) {
    this.subscriptions.add(
      this.isAuthenticated$.subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated
      }),
    )

    this.subscriptions.add(
      this.newlyAuthenticated.subscribe(() => {
        this.router.navigate(['/pitch-trainer/examen-zang'])
      }),
    )
  }

  private readonly password$ = new BehaviorSubject(
    window.localStorage.getItem('music-school-auth') ?? '',
  )

  isAuthenticated$ = this.password$.pipe(
    map((password) => {
      localStorage.setItem('music-school-auth', password)
      return password === 'utopia'
    }),
    share(),
  )

  readonly newlyAuthenticated = this.isAuthenticated$.pipe(
    pairwise(),
    map(([prev, current]) => prev === false && current === true),
  )

  authenticate(password: string): void {
    this.password$.next(password)
  }
}
