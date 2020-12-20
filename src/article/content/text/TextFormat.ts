import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { HorizontalAlign } from '../../shared/HorizontalAlign'
import { VerticalAlign } from '../../shared/VerticalAlign'
import { Padding } from '../../shared/Padding'
import { Format } from '../../shared/format/Format'
import { FONT, FontFamily, FontSize, FontWeight } from '../../../styles/font'
import { COLOR, ColorType } from '../../../styles/color'
import { SPACING } from '../../../styles/layout'

export class TextFormat extends Format {
  constructor(initial?: Partial<TextFormat>) {
    super(initial)
  }

  @field()
  @observable
  italic = false

  @field()
  @observable
  uppercase = false

  @field()
  @observable
  emphasize = false

  @field()
  @observable
  fontFamily: FontFamily = FONT.FAMILY.FILSON

  @field()
  @observable
  fontSize: FontSize = FONT.SIZE.L

  @field()
  @observable
  fontWeight: FontWeight = 400

  @field()
  @observable
  horizontalAlign = HorizontalAlign.LEFT

  @field()
  @observable
  verticalAlign = VerticalAlign.TOP

  @field()
  @observable
  color: ColorType | string = COLOR.BLACK

  @field(Padding)
  @observable
  padding = new Padding(SPACING.L)

  /**
   * @deprecated
   */
  @field()
  @observable
  gridColumnWidth = 1
}
