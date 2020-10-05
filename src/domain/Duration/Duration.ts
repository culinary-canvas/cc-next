import { observable } from 'mobx'

import DurationType from './DurationType'
import { field } from '../../services/db/decorators/field.decorator'

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
  }

  toString = () => {
    return `${this.value} ${this.durationType?.toLowerCase()}`
  }
}

export default Duration
