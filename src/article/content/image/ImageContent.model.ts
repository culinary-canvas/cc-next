import { computed, observable } from 'mobx'
import { field } from '../../../services/db/decorators/field.decorator'
import { ImageSet } from './ImageSet'
import { transient } from '../../../services/db/decorators/transient.decorator'
import { ImageFormat } from './ImageFormat'
import { ContentModel } from '../ContentModel'
import { ContentType } from '../ContentType'

export class ImageContentModel extends ContentModel<ImageFormat> {
  @field(ImageSet)
  @observable
  set: ImageSet

  @field(ImageFormat)
  @observable
  format: ImageFormat

  @transient()
  @observable
  renderedHeight: number

  constructor() {
    super()
    this.set = new ImageSet()
    this.format = new ImageFormat()
    this.type = ContentType.IMAGE
  }

  @computed
  get url() {
    return this.set.image?.url
  }

  @computed
  get alt() {
    return this.set.alt
  }

  @computed
  get hasImage(){
    return !!this.url
  }
}
