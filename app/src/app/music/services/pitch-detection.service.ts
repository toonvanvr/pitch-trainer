import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs'
import { onUnsubscribe } from '../../core/utils/rxjs/operators/on-unsubscribe'
import { initPitchDetection } from '../utils/init-pitch-detection'

@Injectable({ providedIn: 'root' })
export class PitchDetectionService {
  constructor() {
    console.log('Creating pitch detection service')
  }

  /**
   * Toggle on pitch detection.
   *
   * User input is required in browsers to enable audio capture, so attach this
   * to a user event like a button click.
   */
  readonly #enabled$ = new BehaviorSubject<boolean>(false)
  public readonly enabled$ = this.#enabled$.asObservable()
  public togglePitchDetection(enabled?: boolean): void {
    this.#enabled$.next(enabled ?? !this.#enabled$.value)
  }

  /** Pitch detector - null if disabled or error */
  private readonly pitchDetection$ = this.#enabled$.pipe(
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
      }

      let listening = true
      return new Observable<number | null>((subscriber) => {
        const getPitchWhileListening = async () => {
          try {
            if (listening) {
              const frequency = await pitchDetection.getPitch()
              if (listening) {
                subscriber.next(frequency)
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
