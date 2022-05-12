import { computed, observable } from 'mobx'
import { v4 as uuid } from 'uuid'
import { field } from '../../services/db/decorators/field.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import StringUtils from '../../services/utils/StringUtils'
import { ArticlePart } from './ArticlePart'
import { ContentType } from './ContentType'
import { Format } from './Format'

export abstract class ContentModel<T extends Format = Format>
  implements ArticlePart
{
  @transient()
  readonly uid: string

  @field()
  @observable
  name: string

  @field()
  @observable
  type: ContentType

  public abstract format: T

  protected constructor(type: ContentType) {
    this.uid = uuid()
    this.type = type
  }

  @computed
  get displayName(): string {
    return this.name || StringUtils.toDisplayText(this.type)
  }
}
