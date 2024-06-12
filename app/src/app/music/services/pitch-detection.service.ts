import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs'
import { onUnsubscribe } from '../../core/utils/rxjs/operators/on-unsubscribe'
import { Pitch } from '../model/pitch.class'
import { initPitchDetection } from '../utils/ml5.utils'

@Injectable({ providedIn: 'root' })
export class PitchDetectionService {
  /**
   * Toggle on pitch detection from microphone input
   *
   * User input is required in browsers to enable audio capture, so attach this
   * to a user event like a button click.
   */
  readonly #isEnabled$ = new BehaviorSubject<boolean>(false)
  public readonly isEnabled$ = this.#isEnabled$.asObservable()
  public togglePitchDetection(enabled?: boolean): void {
    this.#isEnabled$.next(enabled ?? !this.#isEnabled$.value)
  }

  /** Pitch detector - null if disabled or error */
  private readonly pitchDetection$ = this.#isEnabled$.pipe(
    switchMap(async (enabled) => {
      if (!enabled) {
        return false
      } else {
        return await initPitchDetection()
      }
    }),
  )

  /** Pitch frequency at max rate for this library */
  public readonly pitch$: Observable<Pitch | null> = this.pitchDetection$.pipe(
    switchMap((pitchDetection) => {
      if (!pitchDetection) {
        return of(null)
      }

      let listening = true
      return new Observable<Pitch | null>((subscriber) => {
        const getPitchWhileListening = async () => {
          try {
            if (listening) {
              const frequency = await pitchDetection.getPitch()
              if (listening) {
                if (frequency === null) {
                  subscriber.next(null)
                } else {
                  subscriber.next(new Pitch(frequency))
                }
                getPitchWhileListening()
              }
            }
          } catch (error) {
            subscriber.error(error)
          }
        }
        getPitchWhileListening()
      }).pipe(onUnsubscribe(() => (listening = false)))
    }),
  )
}
