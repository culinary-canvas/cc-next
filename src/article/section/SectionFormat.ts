import { field } from '../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { Format } from '../shared/format/Format'
import { Size } from '../shared/format/Size'

export class SectionFormat extends Format {
  constructor(initial?: Partial<SectionFormat>) {
    super(initial)
  }

  @field()
  @observable
  height = Size.FIT_CONTENT

  @field()
  @observable
  layer = 0

  @field()
  @observable
  shadow = false
}
