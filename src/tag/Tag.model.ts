import { field } from '../services/db/decorators/field.decorator'
import { Model } from '../services/db/Model'
import { observable } from 'mobx'

export class TagModel implements Model {
  @observable
  @field()
  id: string

  @observable
  @field()
  created: Date

  @observable
  @field()
  createdById: string

  @observable
  @field()
  modified: Date

  @observable
  @field()
  modifiedById: string

  @field()
  @observable
  name: string
}
