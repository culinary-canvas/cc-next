import { action, computed, observable } from 'mobx'
import Store from '../../types/Store'
import { ImageCropValues } from '../../domain/Image/ImageCropValues'
import { ImageFile } from '../../domain/Image/ImageFile'

type Serialized = Pick<
  ImageModalStore,
  | 'initialCropValues'
  | 'inputImage'
  | 'inputCropValues'
  | 'newImage'
  | 'newCropValues'
  | 'ready'
>

export class ImageModalStore extends Store<Serialized> {
  @observable initialCropValues = new ImageCropValues(0, 0, 100, 100)
  @observable inputImage: ImageFile
  @observable inputCropValues: ImageCropValues
  @observable newImage: ImageFile
  @observable newCropValues: ImageCropValues
  @observable ready = false

  style = {
    overlay: {
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '2rem',
    },
    content: {
      borderRadius: '1rem',
      border: 'none',
      padding: '1rem',
    },
  }

  @computed
  get hasImageContent() {
    return !!this.image?.fileName
  }

  @computed
  get image() {
    return this.newImage || this.inputImage
  }

  @computed
  get cropValues() {
    return this.newCropValues || this.inputCropValues || this.initialCropValues
  }

  @action
  init(image: ImageFile, cropValues: ImageCropValues) {
    this.inputImage = image
    this.inputCropValues = cropValues
    this.ready = true
  }

  @action
  setNewCropValues(cropValues: ImageCropValues) {
    this.newCropValues = cropValues as ImageCropValues
  }

  @action
  setNewImage(image: ImageFile) {
    this.newImage = image
  }

  @computed
  get cropValuesHasChanged() {
    if (!this.newCropValues) {
      return false
    }
    if (!this.inputCropValues) {
      return true
    }
    return this.cropValuesEquals(this.newCropValues, this.inputCropValues)
  }

  private cropValuesEquals(v1: ImageCropValues, v2: ImageCropValues) {
    return (
      v1.x !== v2.x ||
      v1.y !== v2.y ||
      v1.width !== v2.width ||
      v1.height !== v2.height
    )
  }

  @action
  onDestroy() {
    this.ready = false
    this.inputImage = null
    this.inputCropValues = null
    this.newImage = null
    this.newCropValues = null
  }
}
