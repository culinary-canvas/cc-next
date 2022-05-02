import { makeObservable, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { ContentModel } from './ContentModel'
import { ContentType } from './ContentType'
import { IssueFormat } from './IssueFormat'
import { TextFormat } from './TextFormat'

export class IssueContentModel extends ContentModel<IssueFormat> {
  @field(TextFormat)
  @observable
  format = new IssueFormat()

  constructor() {
    super(ContentType.ISSUE)
    makeObservable(this)
  }
}
