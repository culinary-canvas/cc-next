import { field } from '../../services/db/decorators/field.decorator'
import { observable } from 'mobx'

export class GridPosition {
  @field()
  @observable
  startColumn: number

  @field()
  @observable
  endColumn: number

  @field()
  @observable
  startRow: number

  @field()
  @observable
  endRow: number

  constructor(
    startColumn?: number,
    endColumn?: number,
    startRow = 1,
    endRow = 2,
  ) {
    this.startColumn = startColumn
    this.endColumn = endColumn
    this.startRow = startRow
    this.endRow = endRow
  }
}
