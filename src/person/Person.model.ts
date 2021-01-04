import { observable } from 'mobx'
import { field } from '../services/db/decorators/field.decorator'
import { transient } from '../services/db/decorators/transient.decorator'
import { CompanyModel } from '../company/Company.model'
import { Model } from '../services/db/Model'
import { ImageSet } from '../article/content/image/ImageSet'
import { ImageFormat } from '../article/content/image/ImageFormat'

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
  name = ''

  @observable
  @field()
  title = ''

  @observable
  @field()
  web = ''

  @observable
  @field()
  companyId: string

  @observable
  @field(ImageSet)
  image = new ImageSet()

  @observable
  @field(ImageFormat)
  imageFormat = new ImageFormat()

  @observable
  @transient()
  company: CompanyModel
}
