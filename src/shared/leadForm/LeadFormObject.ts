import { v4 as uuid } from 'uuid'
import { observable } from 'mobx'

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
}
