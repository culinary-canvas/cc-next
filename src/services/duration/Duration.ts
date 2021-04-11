import { makeObservable, observable } from 'mobx'

import { field } from '../db/decorators/field.decorator'
import DurationType from './DurationType'

class Duration {
  @field()
  @observable
  durationType = DurationType.MINUTES

  @field()
  @observable
  value: number

  constructor(value?: number, durationType = DurationType.MINUTES) {
    this.value = value
    this.durationType = durationType
    makeObservable(this)
  }

  toString = () => {
    return `${this.value} ${this.durationType?.toLowerCase()}`
  }
}

export default Duration
