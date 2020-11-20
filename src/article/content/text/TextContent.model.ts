import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { TextFormat } from './TextFormat'
import { ContentModel } from '../ContentModel'
import { ContentType } from '../ContentType'
import {loremIpsum} from 'lorem-ipsum'

export class TextContentModel extends ContentModel<TextFormat> {
  @field()
  @observable
  value: string

  @field()
  @observable
  placeholder: string

  @field(TextFormat)
  @observable
  format: TextFormat

  constructor() {
    super()
    this.format = new TextFormat()
    this.type = ContentType.PARAGRAPH
    this.placeholder = loremIpsum({ units: 'paragraph', count: 1 })
  }
}
