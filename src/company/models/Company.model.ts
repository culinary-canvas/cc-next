import { observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { CompanyType } from './CompanyType'
import { Model } from '../../services/db/Model'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from '../../article/models/ImageFormat'

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
  slug: string

  @observable
  @field()
  type: CompanyType

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
  @field(ImageSet)
  image: ImageSet

  @observable
  @field(ImageFormat)
  imageFormat: ImageFormat

  @observable
  @field()
  partner = false
}
