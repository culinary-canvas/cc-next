import { Model } from '../services/db/Model'
import { computed, observable } from 'mobx'
import { SectionModel } from './section/Section.model'
import { ArticleType } from './ArticleType'
import { ContentType } from './content/ContentType'
import { field } from '../services/db/decorators/field.decorator'
import { collection } from '../services/db/decorators/collection.decorator'
import { TextContentModel } from './content/text/TextContent.model'
import { Content } from './content/Content'
import DateTime from '../services/dateTime/DateTime'
import { ImageContentModel } from './content/image/ImageContent.model'
import { Sortable } from '../services/types/Sortable'

@collection('articles')
export class ArticleModel implements Model, Sortable {
  @observable
  @field()
  id: string

  @observable
  @field(DateTime)
  created: DateTime

  @observable
  @field()
  createdById: string

  @observable
  @field(DateTime)
  modified: DateTime

  @observable
  @field()
  modifiedById: string

  @observable
  @field()
  sortOrder: number

  @observable
  @field(SectionModel)
  sections: SectionModel[] = []

  @observable
  @field()
  authorId: string

  @observable
  @field()
  type: ArticleType

  /**
   * @deprecated
   */
  @observable
  @field()
  tagIds: string[] = []

  @observable
  @field()
  tagNames: string[] = []

  @observable
  @field()
  promoted = false

  @observable
  @field()
  parentId: string

  @observable
  @field()
  published = false

  /**
   * @deprecated
   */
  @observable
  @field()
  titleForUrl: string

  @observable
  @field()
  slug: string

  @computed get sortedSections(): SectionModel[] {
    return [...this.sections].sort((s1, s2) => s1.sortOrder - s2.sortOrder)
  }

  @computed get contents(): Content[] {
    return this.sections.flatMap((s) => s.contents)
  }

  @computed get sortedContents(): Content[] {
    return this.sortedSections.flatMap((s) => s.sortedContents)
  }

  @computed get titleSection(): SectionModel {
    return this.sections[0]
  }

  @computed get titleContent(): TextContentModel {
    return (this.titleSection.contents.find(
      (c) => c instanceof TextContentModel && c.type === ContentType.TITLE,
    ) as unknown) as TextContentModel
  }

  @computed get title(): string {
    return this.titleContent?.value
  }

  @computed get subHeading(): string {
    return (this.titleSection.sortedContents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContentModel)?.value
  }

  @computed get imageContent(): ImageContentModel {
    return this.sortedContents.find(
      (c) => c instanceof ImageContentModel,
    ) as ImageContentModel
  }
}
