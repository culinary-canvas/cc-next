import { field } from '../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { Fit } from '../shared/Fit'
import { Format } from '../shared/format/Format'
import { ColorType } from '../../styles/_color'
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

  /**
   * @deprecated
   */
  @field()
  @observable
  fit = Fit.ARTICLE

  @field()
  @observable
  shadow = false
}
