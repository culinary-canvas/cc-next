import { observable } from 'mobx'
import { field } from '../services/db/decorators/field.decorator'
import { transient } from '../services/db/decorators/transient.decorator'
import { CompanyModel } from '../company/Company.model'
import { Model } from '../services/db/Model'

export class PersonModel implements Model {
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
  title: string

  @observable
  @field()
  web: string

  @observable
  @field()
  companyId: string
  @observable
  @transient()
  company: CompanyModel
}
