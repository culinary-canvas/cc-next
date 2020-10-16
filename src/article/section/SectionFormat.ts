import { field } from '../../services/db/decorators/field.decorator'
import { observable } from 'mobx'
import { Fit } from '../shared/Fit'
import { Format } from '../shared/format/Format'

export class SectionFormat implements Format {
  constructor(initial?: Partial<SectionFormat>) {
    initial && Object.keys(initial).forEach((key) => (this[key] = initial[key]))
  }

  @field()
  @observable
  fit = Fit.ARTICLE

  @field()
  @observable
  size = 1
}