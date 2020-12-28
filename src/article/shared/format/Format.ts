import { GridPosition } from '../../grid/GridPosition'
import { field } from '../../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { ColorType } from '../../../styles/_color'

export abstract class Format {
  protected constructor(initial?: any) {
    initial && Object.keys(initial).forEach((key) => (this[key] = initial[key]))
  }

  @field(GridPosition)
  @observable
  gridPosition: GridPosition

  @field()
  @observable
  layer = 0

  @field()
  @observable
  backgroundColor: ColorType | string
}
