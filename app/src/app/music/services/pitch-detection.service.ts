import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs'
import { onUnsubscribe } from '../../core/utils/rxjs/operators/on-unsubscribe'
import { initPitchDetection } from '../utils/init-pitch-detection'

@Injectable({ providedIn: 'root' })
export class PitchDetectionService {
  /**
   * Toggle on pitch detection.
   *
   * User input is required in browsers to enable audio capture, so attach this
   * to a user event like a button click.
   */
  public readonly enabled$ = new BehaviorSubject<boolean>(false)

  /** Pitch detector - null if disabled or error */
  private readonly pitchDetection$ = this.enabled$.pipe(
    switchMap(async (enabled) => {
      if (!enabled) {
        return false
      } else {
        return await initPitchDetection()
      }
    }),
  )

  /** Pitch frequency at max rate for this library */
  public readonly pitch$ = this.pitchDetection$.pipe(
    switchMap((pitchDetection) => {
      if (!pitchDetection) {
        return of(null)
      } else {
        let listening = true
        return new Observable<number | null>((subscriber) => {
          const getPitchWhileListening = async () => {
            if (listening) {
              const freq = await pitchDetection.getPitch((error, frequency) => {
                if (error) {
                  subscriber.error(error)
                } else {
                  // also filter out delayed responses in case the frontend
                  // logic assumes no output comes after unsubscribing
                  if (listening) {
                    subscriber.next(frequency)
                    getPitchWhileListening()
                  }
                }
              })
            }
          }
          getPitchWhileListening()
        }).pipe(
          onUnsubscribe(() => {
            listening = false
          }),
        )
      }
    }),
  )
}
