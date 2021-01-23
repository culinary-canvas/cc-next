import { Format } from '../shared/format/Format'
import { transient } from '../../services/db/decorators/transient.decorator'
import { field } from '../../services/db/decorators/field.decorator'
import { computed, observable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { Orientation } from '../shared/Orientation'
import { ContentType } from './ContentType'
import StringUtils from '../../services/utils/StringUtils'
import { ArticlePart } from '../shared/ArticlePart'

export abstract class ContentModel<T extends Format = Format>
  implements ArticlePart {
  @transient()
  readonly uid: string

  @field()
  @observable
  name: string

  /**
   * @deprecated
   */
  @field()
  @observable
  alignToPrevious: Orientation

  @field()
  @observable
  type: ContentType

  /**
   * @deprecated
   */
  @field()
  @observable
  sortOrder: number

  abstract format: T

  protected constructor() {
    this.uid = uuid()
  }

  @computed
  get displayName(): string {
    return this.name || StringUtils.toDisplayText(this.type)
  }
}
