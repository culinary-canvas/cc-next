import { field } from '../../services/db/decorators/field.decorator'
import { makeObservable, observable } from 'mobx'

export class ImageFile {
  @field()
  @observable
  fileName: string

  @field()
  @observable
  mimeType: string

  @field()
  @observable
  url: string

  @field()
  @observable
  width: number

  @field()
  @observable
  height: number

  constructor() {
    makeObservable(this)
  }
}
