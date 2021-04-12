import { field } from '../../services/db/decorators/field.decorator'
import { makeObservable, observable } from 'mobx'
import { Padding } from './Padding'
import { HorizontalAlign } from './HorizontalAlign'
import { VerticalAlign } from './VerticalAlign'
import { SPACING } from '../../styles/layout'
import { Format } from './Format'
import { ImageFit } from './ImageFit'

export class ImageFormat extends Format {
  constructor(initial?: Partial<ImageFormat>) {
    super(initial)
    makeObservable(this)
  }

  @field()
  @observable
  maxHeight: number

  @field()
  @observable
  fit = ImageFit.CONTAIN

  @field()
  @observable
  horizontalAlign = HorizontalAlign.LEFT

  @field()
  @observable
  verticalAlign = VerticalAlign.TOP

  @field(Padding)
  @observable
  padding = new Padding(SPACING.L)

  @field()
  @observable
  circle = false
}
