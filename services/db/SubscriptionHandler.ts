import { v4 as uuid } from 'uuid'

export class SubscriptionHandler {
  readonly id = uuid()
  firestoreUnsubscribe: () => void

  constructor() {
    console.debug('Registering subscription handler', this.id)
  }

  unsubscribe() {
    console.debug('Unsubscribing', this.id)
    this.firestoreUnsubscribe()
  }
}
