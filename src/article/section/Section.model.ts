import { computed, observable } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import { v1 as uuid } from 'uuid'
import { SectionFormat } from './SectionFormat'
import { ContentModel } from '../content/ContentModel'
import { Orientation } from '../shared/Orientation'
import { SectionPreset } from './SectionPreset'
import { transform } from '../../services/db/decorators/transform.decorator'
import { ArticlePart } from '../ArticlePart'
import { SectionService } from './Section.service'

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

  /**
   * @deprecated
   */
  @field()
  @observable
  sortOrder: number

  /**
   * @deprecated
   */
  @computed
  get columns(): ContentModel[][] {
    return (
      this.contents?.reduce<ContentModel[][]>((columns, content, i) => {
        if (i === 0) {
          return [[content]]
        }
        if (content.alignToPrevious === Orientation.VERTICAL) {
          columns[columns.length - 1].push(content)
        } else {
          columns.push([content])
        }
        return columns
      }, []) || []
    )
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
