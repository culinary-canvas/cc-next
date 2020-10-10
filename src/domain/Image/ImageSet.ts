import { ImageFile } from './ImageFile'
import { field } from '../../services/db/decorators/field.decorator'
import { computed, observable } from 'mobx'
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

  @field(ImageFile)
  @observable
  xl: ImageFile

  @field(ImageFile)
  @observable
  l: ImageFile

  @field(ImageFile)
  @observable
  m: ImageFile

  @field(ImageFile)
  @observable
  s: ImageFile

  @computed
  get image() {
    /*
    const screenWidth = !!window || window.innerWidth
    if (screenWidth <= BREAKPOINT.PHONE && !!this.s) {
      return this.s
    } else if (screenWidth <= BREAKPOINT.TABLET && !!this.m) {
      return this.m
    } else if (screenWidth <= BREAKPOINT.DESKTOP_S && !!this.l) {
      return this.l
    } else if (screenWidth <= BREAKPOINT.DESKTOP_L && !!this.xl) {
      return this.xl
    } else if (!!this.cropped) {
      return this.cropped
    } else {
      return this.original
    }
    */
    return this.cropped
  }
}
