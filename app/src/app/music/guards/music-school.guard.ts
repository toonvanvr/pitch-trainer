import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { MusicSchoolAuthService } from '../services/music-school-auth.service'

export const musicSchoolGuard: CanActivateFn = (route, state) => {
  const musicSchoolAuth = inject(MusicSchoolAuthService)
  const router = inject(Router)
  if (!musicSchoolAuth.isAuthenticated) {
    router.navigate(['/beveiliging'])
  }
  return musicSchoolAuth.isAuthenticated
}
