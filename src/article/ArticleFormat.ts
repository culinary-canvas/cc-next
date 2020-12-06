import { observable } from 'mobx'
import { field } from '../services/db/decorators/field.decorator'
import { COLOR } from '../styles/color'

export class ArticleFormat {
  @observable
  @field()
  backgroundColor: string = COLOR.WHITE
}
