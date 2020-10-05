import { field } from '../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { TextFormat } from './TextFormat'
import { Content } from '../Content/Content'
import { ContentType } from './ContentType'

export class TextContent extends Content {
  @field()
  @observable
  value: string

  @field(TextFormat)
  @observable
  format: TextFormat

  constructor() {
    super()
    this.format = new TextFormat()
    this.type = ContentType.PARAGRAPH
  }
}
