import { makeObservable, observable } from 'mobx'
import { ImageFormat } from '../../article/models/ImageFormat'
import { ImageSet } from '../../image/models/ImageSet'
import { field } from '../../services/db/decorators/field.decorator'
import { Model } from '../../services/db/Model'

export class IssueModel implements Model {
  @observable
  @field(Date)
  created: Date

  @observable
  @field()
  createdById: string

  @observable
  @field()
  id: string

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
  description = ''

  @observable
  @field(Date)
  publishMonth: Date

  @observable
  @field(ImageSet)
  imageSet: ImageSet

  @observable
  @field(ImageFormat)
  imageFormat: ImageFormat

  constructor() {
    makeObservable(this)
  }
}
