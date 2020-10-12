import { Format } from '../shared/format/Format'
import { transient } from '../../services/db/decorators/transient.decorator'
import { field } from '../../services/db/decorators/field.decorator'
import { computed, observable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { Orientation } from '../shared/Orientation'
import { ContentType } from './ContentType'
import StringUtils from '../../services/utils/StringUtils'

export abstract class Content<T extends Format = any> {
  @transient()
  readonly uid: string

  @field()
  @observable
  name: string

  @field()
  @observable
  sortOrder: number

  @field()
  @observable
  alignToPrevious: Orientation

  @field()
  @observable
  type: ContentType

  abstract format: T

  protected constructor() {
    this.uid = uuid()
    this.alignToPrevious = Orientation.VERTICAL
  }

  @computed
  get displayName(): string {
    return this.name || StringUtils.toDisplayText(this.type)
  }
}
