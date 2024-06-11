import { Observable, Subscriber } from 'rxjs'

// TODO: verify whether this is a hot or cold pipe
// Nicolas Gehlert
// https://developapa.com/rxjs-teardown/
export function onUnsubscribe(callback: () => void) {
  return function <T>(source: Observable<T>): Observable<T> {
    return new Observable((subscriber: Subscriber<T>) => {
      const subscription = source.subscribe({
        next(value: any) {
          subscriber.next(value)
        },
        error(error: Error) {
          subscriber.error(error)
        },
        complete() {
          subscriber.complete()
        },
      })

      return () => {
        callback()
        subscription.unsubscribe()
      }
    })
  }
}
