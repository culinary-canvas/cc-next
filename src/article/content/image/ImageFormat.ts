import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { Padding } from '../../shared/Padding'
import { Format } from '../../shared/format/Format'
import { HorizontalAlign } from '../../shared/HorizontalAlign'
import { VerticalAlign } from '../../shared/VerticalAlign'
import {SPACING} from '../../../styles/layout'

export class ImageFormat implements Format {
  constructor(initial?: Partial<ImageFormat>) {
    initial && Object.keys(initial).forEach((key) => (this[key] = initial[key]))
  }

  @field()
  @observable
  size: number

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
  background = false

  @field()
  @observable
  gridColumnWidth = 1
}
