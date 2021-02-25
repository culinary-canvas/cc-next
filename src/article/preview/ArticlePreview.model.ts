import { observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { ImageSet } from '../content/image/ImageSet'
import { ImageFormat } from '../content/image/ImageFormat'

export class ArticlePreviewModel {
  @observable
  @field()
  useArticleImage = true

  @observable
  @field(ImageSet)
  image = new ImageSet()

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
}
