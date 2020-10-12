import { computed, observable, toJS } from 'mobx'
import { field } from '../../services/db/decorators/field.decorator'
import { transient } from '../../services/db/decorators/transient.decorator'
import { v1 as uuid } from 'uuid'
import { SectionFormat } from './SectionFormat'
import { Content } from '../content/Content'
import { Orientation } from '../shared/Orientation'
import { SectionPreset } from './SectionPreset'
import { ImageContentModel } from '../content/image/ImageContent.model'
import { Transformer } from '../../services/db/Transformer'
import { TextContentModel } from '../content/text/TextContent.model'
import { transform } from '../../services/db/decorators/transform.decorator'
import { ContentType } from '../content/ContentType'

export class SectionModel {
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

  @field(TextContentModel)
  @transform<Content[]>({
    toApp: (objects) =>
      objects?.map((o) =>
        Transformer.toApp<Content>(
          o,
          !!o.type && o.type === ContentType.IMAGE ? ImageContentModel : TextContentModel,
        ),
      ),
    toDb: (objects) => objects?.map((o) => Transformer.toDb(o)),
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
