import { ImageFile } from './ImageFile'
import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
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

  @field(ImageFile)
  @observable
  cropped: ImageFile
}
