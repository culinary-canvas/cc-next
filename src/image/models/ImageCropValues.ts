import { observable, makeObservable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'

export class ImageCropValues {
  @field()
  @observable
  x: number

  @field()
  @observable
  y: number

  @field()
  @observable
  width: number

  @field()
  @observable
  height: number

  @field()
  readonly unit = '%'

  constructor(x: number, y: number, width: number, height: number) {
    makeObservable(this)
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}
