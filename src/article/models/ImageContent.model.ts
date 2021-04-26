import { computed, makeObservable, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from './ImageFormat'
import { ContentModel } from './ContentModel'
import { ContentType } from './ContentType'

export class ImageContentModel extends ContentModel<ImageFormat> {
  @field(ImageSet)
  @observable
  set = new ImageSet()

  @field(ImageFormat)
  @observable
  format = new ImageFormat()

  constructor() {
    super(ContentType.IMAGE)
    makeObservable(this)
  }

  @computed
  get url() {
    return this.set.url
  }

  @computed
  get alt() {
    return this.set.alt
  }

  @computed
  get hasImage() {
    return !!this.url
  }
}
