import { makeObservable, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { SPACING } from '../../styles/layout'
import { Format } from './Format'
import { HorizontalAlign } from './HorizontalAlign'
import { Padding } from './Padding'
import { VerticalAlign } from './VerticalAlign'

export class IssueFormat extends Format {
  constructor(initial?: Partial<IssueFormat>) {
    super(initial)
    makeObservable(this)
  }

  @field()
  @observable
  horizontalAlign = HorizontalAlign.LEFT

  @field()
  @observable
  verticalAlign = VerticalAlign.TOP

  @field(Padding)
  @observable
  padding = new Padding(SPACING.L)
}
