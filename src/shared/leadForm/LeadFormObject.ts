import { v4 as uuid } from 'uuid'
import { observable, makeObservable } from 'mobx';

export class LeadFormObject {
  readonly id = uuid()

  @observable
  firstName = ''

  @observable
  lastName = ''

  @observable
  email = ''

  @observable
  newsletter = false

  constructor() {
    makeObservable(this)
  }
}
