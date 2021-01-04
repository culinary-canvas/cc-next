import { observable } from 'mobx'
import { Model } from '../services/db/Model'
import { field } from '../services/db/decorators/field.decorator'

export class ArticleSeriesModel implements Model {
  @observable
  @field()
  id: string

  @observable
  @field(Date)
  created: Date

  @observable
  @field()
  createdById: string

  @observable
  @field(Date)
  modified: Date

  @observable
  @field()
  modifiedById: string

  @observable
  @field()
  name: string

  @observable
  @field()
  articleIds: string[]
}
