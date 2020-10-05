import { field } from '../../services/db/decorators/field.decorator'
import { Model } from '../../services/db/Model'
import { observable } from 'mobx'
import { collection } from '../../services/db/decorators/collection.decorator'
import DateTime from '../DateTime/DateTime'

@collection('tags')
export class Tag implements Model {
  @observable
  @field()
  id: string

  @observable
  @field(DateTime)
  created: DateTime

  @observable
  @field()
  createdById: string

  @observable
  @field(DateTime)
  modified: DateTime

  @observable
  @field()
  modifiedById: string

  @field()
  @observable
  name: string
}
