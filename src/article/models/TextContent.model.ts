import { loremIpsum } from 'lorem-ipsum'
import { makeObservable, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { ContentModel } from './ContentModel'
import { ContentType } from './ContentType'
import { TextFormat } from './TextFormat'

export class TextContentModel extends ContentModel<TextFormat> {
  @field()
  @observable
  value = ''

  @field()
  @observable
  placeholder = loremIpsum({ units: 'paragraph', count: 1 })

  @field(TextFormat)
  @observable
  format = new TextFormat()

  constructor() {
    super(ContentType.PARAGRAPH)
    makeObservable(this)
  }
}
