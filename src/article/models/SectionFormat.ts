import { field } from '../../services/db/decorators/field.decorator'
import { makeObservable, observable } from 'mobx'
import { Format } from './Format'
import { Size } from './Size'

export class SectionFormat extends Format {
  constructor(initial?: Partial<SectionFormat>) {
    super(initial)
    makeObservable(this)
  }

  @field()
  @observable
  height = Size.FIT_CONTENT

  @field()
  @observable
  shadow = false
}
