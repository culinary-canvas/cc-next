import { computed, makeObservable, observable } from 'mobx'
import { v1 as uuid } from 'uuid'
import { field } from '../../services/db/decorators/field.decorator'
import { transform } from '../../services/db/decorators/transform.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import { SectionService } from '../section/Section.service'
import { ArticlePart } from './ArticlePart'
import { ContentModel } from './ContentModel'
import { SectionFormat } from './SectionFormat'
import { SectionPreset } from './SectionPreset'

export class SectionModel implements ArticlePart {
  @transient()
  uid = uuid()

  @field()
  @observable
  name: string

  @field(SectionFormat)
  @observable
  format = new SectionFormat()

  @field()
  @observable
  preset: SectionPreset

  @field()
  @transform<ContentModel[]>({
    toApp: SectionService.contentsToApp,
    toDb: SectionService.contentsToDb,
  })
  @observable
  contents: ContentModel[] = []

  constructor() {
    makeObservable(this)
  }

  @computed
  get displayName(): string {
    return (
      this.name ||
      `Section (${this.format.gridPosition?.startRow || '?'}:${
        this.format.gridPosition?.startColumn || '?'
      })`
    )
  }
}
