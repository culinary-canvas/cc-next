import { observable } from 'mobx'
import { field } from '../services/db/decorators/field.decorator'
import { CompanyType } from './CompanyType'
import { Model } from '../services/db/Model'

export class CompanyModel implements Model {
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
  name = ''

  @observable
  @field()
  type = CompanyType.RESTAURANT

  @observable
  @field()
  web = ''
}
