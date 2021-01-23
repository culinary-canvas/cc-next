import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { Padding } from '../../shared/Padding'
import { HorizontalAlign } from '../../shared/HorizontalAlign'
import { VerticalAlign } from '../../shared/VerticalAlign'
import { SPACING } from '../../../styles/layout'
import { Format } from '../../shared/format/Format'
import { ImageFit } from './ImageFit'

export class ImageFormat extends Format {
  constructor(initial?: Partial<ImageFormat>) {
    super(initial)
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

  /**
   * @deprecated
   */
  @field()
  @observable
  background = false

  /**
   * @deprecated
   */
  @field()
  @observable
  gridColumnWidth: number | 'min-content' | 'max-content' = 1

  @field()
  @observable
  circle = false
}
