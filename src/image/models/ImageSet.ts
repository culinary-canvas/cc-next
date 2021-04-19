import { ImageFile } from './ImageFile'
import { field } from '../../services/db/decorators/field.decorator'
import { computed, makeObservable, observable } from 'mobx'
import { ImageCropValues } from './ImageCropValues'

export class ImageSet {
  @observable
  @field()
  alt: string

  @field(ImageFile)
  @observable
  original: ImageFile = new ImageFile()

  @field(ImageCropValues)
  @observable
  cropValues: ImageCropValues

  /**
   * @deprecated
   */
  @field(ImageFile)
  @observable
  cropped: ImageFile

  @field(ImageFile)
  @observable
  image: ImageFile

  constructor() {
    makeObservable(this)
  }

  @computed
  get url(): string {
    return this.image?.url
  }

  @computed
  get width(): number {
    return this.image?.width
  }

  @computed
  get height(): number {
    return this.image?.height
  }
}
