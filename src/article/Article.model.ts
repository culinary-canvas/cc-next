import { Model } from '../services/db/Model'
import { computed, observable } from 'mobx'
import { SectionModel } from './section/Section.model'
import { ArticleType } from './ArticleType'
import { ContentType } from './content/ContentType'
import { field } from '../services/db/decorators/field.decorator'
import { TextContentModel } from './content/text/TextContent.model'
import { ContentModel } from './content/ContentModel'
import { ImageContentModel } from './content/image/ImageContent.model'
import { Sortable } from '../types/Sortable'
import { isSystemColor } from '../styles/_color'
import { ArticleFormat } from './ArticleFormat'

export class ArticleModel implements Model, Sortable {
  @observable
  @field()
  id: string

  @observable
  @field(Date)
  created: Date

  @observable
  @field()
  createdById: string

  @observable
  @field(Date)
  modified: Date

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

  @observable
  @field()
  format = new ArticleFormat()

  @computed get contents(): ContentModel[] {
    return this.sections.flatMap((s) => s.contents)
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
    return (this.titleSection.contents.find(
      (c) => c.type === ContentType.SUB_HEADING,
    ) as TextContentModel)?.value
  }

  @computed get imageContent(): ImageContentModel {
    return this.contents.find(
      (c) => c instanceof ImageContentModel,
    ) as ImageContentModel
  }

  @computed get colors(): string[] {
    const customColors = new Set<string>()
    this.sections
      .filter(
        (s) =>
          !!s.format.backgroundColor &&
          !isSystemColor(s.format.backgroundColor),
      )
      .forEach((s) => customColors.add(s.format.backgroundColor))
    this.contents
      .filter(
        (c) =>
          c instanceof TextContentModel &&
          !!c.format.color &&
          !isSystemColor(c.format.color),
      )
      .forEach((c) => customColors.add((c as TextContentModel).format.color))
    return Array.from(customColors)
  }
}
