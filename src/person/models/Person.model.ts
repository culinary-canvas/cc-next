import { observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import { CompanyModel } from '../../company/models/Company.model'
import { Model } from '../../services/db/Model'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from '../../article/models/ImageFormat'

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
  slug: string

  @observable
  @field()
  title = ''

  @observable
  @field()
  web = ''

  @observable
  @field()
  facebook = ''

  @observable
  @field()
  twitter = ''

  @observable
  @field()
  instagram = ''

  @observable
  @field()
  description = ''

  @observable
  @field()
  companyId: string

  @observable
  @field(ImageSet)
  image: ImageSet

  @observable
  @field(ImageFormat)
  imageFormat: ImageFormat

  @observable
  @transient()
  company: CompanyModel
}
