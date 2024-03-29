import { makeObservable, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from './ImageFormat'

export class ArticlePreviewModel {
  @observable
  @field()
  useArticleImage = true

  /**
   * @deprecated
   */
  @observable
  @field(ImageSet)
  image: ImageSet

  @observable
  @field(ImageSet)
  imageSet: ImageSet

  @observable
  @field(ImageFormat)
  imageFormat = new ImageFormat()

  @observable
  @field()
  alt = ''

  @observable
  @field()
  useArticleTitle = true

  @observable
  @field()
  title = ''

  @observable
  @field()
  useArticleText = true

  @observable
  @field()
  text = ''

  constructor() {
    makeObservable(this)
  }
}
