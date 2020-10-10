import { Model } from '../../services/db/Model'
import { computed, observable } from 'mobx'
import { Section } from '../Section/Section'
import { ArticleType } from './ArticleType'
import { ContentType } from '../Text/ContentType'
import { field } from '../../services/db/decorators/field.decorator'
import { collection } from '../../services/db/decorators/collection.decorator'
import { TextContent } from '../Text/TextContent'
import { Content } from '../Content/Content'
import DateTime from '../DateTime/DateTime'
import { ImageContent } from '../Image/ImageContent'
import { Sortable } from '../../types/Sortable'

@collection('articles')
export class Article implements Model, Sortable {
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
  @field(Section)
  sections: Section[] = []

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

  @computed get sortedSections(): Section[] {
    return [...this.sections].sort((s1, s2) => s1.sortOrder - s2.sortOrder)
  }

  @computed get contents(): Content[] {
    return this.sections.flatMap((s) => s.contents)
  }

  @computed get sortedContents(): Content[] {
    return this.sortedSections.flatMap((s) => s.sortedContents)
  }

  @computed get titleSection(): Section {
    return this.sections[0]
  }

  @computed get titleContent(): TextContent {
    return (this.titleSection.contents.find(
      (c) => c instanceof TextContent && c.type === ContentType.TITLE,
    ) as unknown) as TextContent
  }

  @computed get title(): string {
    return this.titleContent?.value
  }

  @computed get subHeading(): string {
    return (this.titleSection.sortedContents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContent)?.value
  }

  @computed get imageContent(): ImageContent {
    return this.sortedContents.find(
      (c) => c instanceof ImageContent,
    ) as ImageContent
  }
}
