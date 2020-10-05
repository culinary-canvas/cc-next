import { computed, observable, toJS } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import { v1 as uuid } from 'uuid'
import { SectionFormat } from './SectionFormat'
import { Content } from '../Content/Content'
import { Orientation } from './Orientation'
import { SectionPreset } from './SectionPreset'
import { ImageContent } from '../Image/ImageContent'
import { DbTransformService } from '../../services/db/DbTransform.service'
import { TextContent } from '../Text/TextContent'
import { transform } from '../../services/db/decorators/transform.decorator'
import { ContentType } from '../Text/ContentType'

export class Section {
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

  @field(TextContent)
  @transform<Content[]>({
    toApp: (objects) =>
      objects?.map((o) =>
        DbTransformService.transformToApp<Content>(
          o,
          !!o.type && o.type === ContentType.IMAGE ? ImageContent : TextContent,
        ),
      ),
    toDb: (objects) => {
      console.log(
        toJS(objects),
        objects?.map((o) => DbTransformService.transformToDb(o)),
      )
      return objects?.map((o) => DbTransformService.transformToDb(o))
    },
  })
  @observable
  contents: Content[] = []

  @field()
  @observable
  sortOrder: number

  @computed
  get sortedContents() {
    return this.contents
      ? [...this.contents].sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      : []
  }

  @computed
  get columns(): Content[][] {
    return (
      this.sortedContents?.reduce<Content[][]>((columns, content, i) => {
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
  get rowsLength(): number {
    return this.columns.reduce<number>(
      (max, col) => (col.length > max ? col.length : max),
      0,
    )
  }

  @computed
  get displayName(): string {
    return this.name || `Section (${this.sortOrder})`
  }
}
